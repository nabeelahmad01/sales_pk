import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import dbConnect from '@/lib/mongodb';
import Sale from '@/models/Sale';
import User from '@/models/User';

const resend = new Resend(process.env.RESEND_API_KEY);

// This should be called by a cron job daily
// Add to vercel.json: { "crons": [{ "path": "/api/notifications/sale-expiry", "schedule": "0 9 * * *" }] }

export async function POST(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Find sales ending in the next 2 days
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
    
    const endingSoon = await Sale.find({
      isActive: true,
      endDate: { $gte: new Date(), $lte: twoDaysFromNow },
    });

    if (endingSoon.length === 0) {
      return NextResponse.json({ success: true, message: 'No sales ending soon' });
    }

    // Get users who want expiry alerts
    const users = await User.find({ 
      saleExpiryAlerts: true,
      isEmailVerified: true,
    });

    let emailsSent = 0;

    for (const user of users) {
      // Check if any favorited sale is ending soon
      const userEndingSales = endingSoon.filter(sale => 
        user.favorites.includes(sale._id.toString())
      );

      if (userEndingSales.length > 0) {
        await resend.emails.send({
          from: 'ShowSales.pk <onboarding@resend.dev>',
          to: user.email,
          subject: '⏰ Your Saved Sales are Ending Soon!',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #EF4444;">⏰ Sales Ending Soon!</h1>
              <p>Hi ${user.name},</p>
              <p>Some of your saved sales are about to expire! Don't miss out:</p>
              ${userEndingSales.map(sale => {
                const daysLeft = Math.ceil((new Date(sale.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                return `
                  <div style="background: #FEF2F2; padding: 15px; border-radius: 8px; margin: 10px 0; border-left: 4px solid #EF4444;">
                    <h3 style="margin: 0;">${sale.title}</h3>
                    <p style="color: #EF4444; font-weight: bold;">Only ${daysLeft} days left! - ${sale.discountPercentage}% OFF</p>
                    <a href="${process.env.NEXTAUTH_URL}/sales/${sale._id}" style="color: #8b5cf6;">Shop Now →</a>
                  </div>
                `;
              }).join('')}
              <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
                You're receiving this because you have sale expiry alerts enabled.
                <a href="${process.env.NEXTAUTH_URL}/profile">Manage preferences</a>
              </p>
            </div>
          `,
        });
        emailsSent++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Sent ${emailsSent} expiry alerts`,
    });
  } catch (error) {
    console.error('Sale expiry notification error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send notifications' },
      { status: 500 }
    );
  }
}
