import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Sale from '@/models/Sale';
import Subscriber from '@/models/Subscriber';
import nodemailer from 'nodemailer';

// This endpoint should be called by a cron job (e.g., Vercel Cron, GitHub Actions)
// It sends email notifications for sales ending soon

const DAYS_BEFORE_EXPIRY = 2; // Send notification 2 days before sale ends

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Find sales ending in the next 2 days
    const now = new Date();
    const futureDate = new Date(now.getTime() + DAYS_BEFORE_EXPIRY * 24 * 60 * 60 * 1000);
    
    const endingSales = await Sale.find({
      isActive: true,
      endDate: {
        $gte: now,
        $lte: futureDate,
      },
    }).sort({ endDate: 1 });

    if (endingSales.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'No sales ending soon',
        salesCount: 0 
      });
    }

    // Get all active subscribers
    const subscribers = await Subscriber.find({ isActive: true });
    
    if (subscribers.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'No subscribers to notify',
        salesCount: endingSales.length 
      });
    }

    // Build email content
    const salesList = endingSales.map(sale => {
      const daysLeft = Math.ceil((new Date(sale.endDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return `
        <tr>
          <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
            <div style="font-weight: 600; color: #1e1b4b;">${sale.title}</div>
            <div style="font-size: 14px; color: #64748b;">${sale.brandName}</div>
          </td>
          <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; text-align: center;">
            <span style="background: linear-gradient(135deg, #ef4444, #f97316); color: white; padding: 4px 12px; border-radius: 20px; font-weight: 600;">
              ${sale.discountPercentage}% OFF
            </span>
          </td>
          <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; text-align: center; color: #ef4444; font-weight: 600;">
            ${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} left
          </td>
        </tr>
      `;
    }).join('');

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(135deg, #8b5cf6, #ec4899); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">⏰ Sales Ending Soon!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Don't miss these amazing deals</p>
          </div>
          
          <div style="padding: 30px;">
            <p style="color: #374151; font-size: 16px; margin-bottom: 20px;">
              Hey there! 👋 These sales are ending in the next ${DAYS_BEFORE_EXPIRY} days. Grab them before they're gone!
            </p>
            
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #f9fafb;">
                  <th style="padding: 12px; text-align: left; color: #6b7280; font-size: 12px; text-transform: uppercase;">Sale</th>
                  <th style="padding: 12px; text-align: center; color: #6b7280; font-size: 12px; text-transform: uppercase;">Discount</th>
                  <th style="padding: 12px; text-align: center; color: #6b7280; font-size: 12px; text-transform: uppercase;">Time Left</th>
                </tr>
              </thead>
              <tbody>
                ${salesList}
              </tbody>
            </table>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://showsales.pk'}/sales" 
                 style="display: inline-block; background: linear-gradient(135deg, #8b5cf6, #ec4899); color: white; text-decoration: none; padding: 14px 30px; border-radius: 30px; font-weight: 600;">
                View All Sales →
              </a>
            </div>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af;">
            <p style="margin: 0;">© ${new Date().getFullYear()} ShowSales.pk - Never Miss a Sale!</p>
            <p style="margin: 10px 0 0 0;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://showsales.pk'}" style="color: #8b5cf6;">Visit Website</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send emails to all subscribers
    let sentCount = 0;
    let errorCount = 0;
    
    for (const subscriber of subscribers) {
      try {
        await transporter.sendMail({
          from: `"ShowSales.pk" <${process.env.EMAIL_USER}>`,
          to: subscriber.email,
          subject: `⏰ ${endingSales.length} Sales Ending Soon - Don't Miss Out!`,
          html: emailHtml,
        });
        sentCount++;
      } catch (error) {
        console.error(`Failed to send to ${subscriber.email}:`, error);
        errorCount++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Sent ${sentCount} emails, ${errorCount} failed`,
      salesCount: endingSales.length,
      subscribersNotified: sentCount,
      errors: errorCount,
    });
  } catch (error) {
    console.error('Error in sale-expiry cron:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process sale expiry notifications' },
      { status: 500 }
    );
  }
}
