import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Subscriber from '@/models/Subscriber';
import User from '@/models/User';
import { sendEmail } from '@/lib/email';

// POST - Send promotional email to all users and active subscribers
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { subject, content, testEmail, emailList } = await request.json();
    
    if (!subject || !content) {
      return NextResponse.json(
        { success: false, error: 'Subject and content are required' },
        { status: 400 }
      );
    }

    // Determine target emails
    let targetEmails: string[] = [];
    
    if (testEmail) {
      // Test mode - send to single email
      targetEmails = [testEmail];
    } else if (emailList && Array.isArray(emailList) && emailList.length > 0) {
      // Use provided email list (from frontend - includes users + subscribers + imported)
      targetEmails = [...new Set(emailList.map((e: string) => e.toLowerCase()))];
    } else {
      // Fallback - fetch from DB
      const users = await User.find({}, { email: 1 });
      const subscribers = await Subscriber.find({ isActive: true }, { email: 1 });
      
      const userEmails = users.map(u => u.email.toLowerCase());
      const subscriberEmails = subscribers.map(s => s.email.toLowerCase());
      
      targetEmails = [...new Set([...userEmails, ...subscriberEmails])];
    }

    if (targetEmails.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No recipients found' },
        { status: 400 }
      );
    }

    // Send emails in batches
    const results = {
      sent: 0,
      failed: 0,
      errors: [] as string[],
    };

    console.log(`📧 Sending promotional email to ${targetEmails.length} recipients...`);
    console.log('Recipients:', targetEmails);

    // Send to each recipient (batch of 10)
    const batchSize = 10;
    for (let i = 0; i < targetEmails.length; i += batchSize) {
      const batch = targetEmails.slice(i, i + batchSize);
      
      const emailPromises = batch.map(async (email) => {
        try {
          const result = await sendEmail({
            to: email,
            subject: subject,
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f5; margin: 0; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <div style="background: linear-gradient(135deg, #8B5CF6, #EC4899); padding: 30px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px;">🛍️ ShowSales.pk</h1>
                  </div>
                  <div style="padding: 30px;">
                    ${content}
                  </div>
                  <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0; color: #6b7280; font-size: 14px;">
                      You're receiving this because you're a member of ShowSales.pk
                    </p>
                    <p style="margin: 10px 0 0; font-size: 12px; color: #9ca3af;">
                      <a href="https://showsales.pk" style="color: #8B5CF6;">Visit ShowSales.pk</a>
                    </p>
                  </div>
                </div>
              </body>
              </html>
            `,
          });
          console.log(`✓ Email sent to ${email}:`, result);
          results.sent++;
        } catch (err: any) {
          console.error(`✗ Failed to send to ${email}:`, err.message);
          results.failed++;
          results.errors.push(`${email}: ${err.message}`);
        }
      });

      await Promise.all(emailPromises);
    }

    console.log(`📧 Email sending complete. Sent: ${results.sent}, Failed: ${results.failed}`);

    return NextResponse.json({
      success: true,
      message: `Promotional email sent successfully!`,
      results: {
        totalTargeted: targetEmails.length,
        sent: results.sent,
        failed: results.failed,
        errors: results.errors.slice(0, 5), // Only return first 5 errors
      },
    });
  } catch (error: any) {
    console.error('Error sending promotional emails:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to send promotional emails' },
      { status: 500 }
    );
  }
}
