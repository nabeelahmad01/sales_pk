import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import dbConnect from '@/lib/mongodb';
import Sale from '@/models/Sale';
import User from '@/models/User';

// This should be called by a cron job (e.g., Vercel Cron)
// Add to vercel.json: { "crons": [{ "path": "/api/notifications/price-drop", "schedule": "0 */6 * * *" }] }

export async function POST(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Find sales with recent price drops
    const recentPriceDrops = await Sale.find({
      isActive: true,
      'priceHistory.1': { $exists: true }, // Has price history
    });

    const salesWithDrops = recentPriceDrops.filter(sale => {
      if (sale.priceHistory.length < 2) return false;
      const latest = sale.priceHistory[sale.priceHistory.length - 1];
      const previous = sale.priceHistory[sale.priceHistory.length - 2];
      return latest.price < previous.price;
    });

    if (salesWithDrops.length === 0) {
      return NextResponse.json({ success: true, message: 'No price drops found' });
    }

    // Get users who want price alerts
    const users = await User.find({ 
      priceAlerts: true,
      isEmailVerified: true,
    });

    let emailsSent = 0;

    for (const user of users) {
      // Check if any favorited sale has a price drop
      const userDrops = salesWithDrops.filter(sale => 
        user.favorites.includes(sale._id.toString())
      );

      if (userDrops.length > 0) {
        await sendEmail({
          to: user.email,
          subject: '🔔 Price Drop Alert - Your Saved Sales!',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #8b5cf6;">🏷️ Price Drop Alert!</h1>
              <p>Hi ${user.name},</p>
              <p>Great news! Some of your saved sales have dropped in price:</p>
              ${userDrops.map(sale => `
                <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 10px 0;">
                  <h3 style="margin: 0;">${sale.title}</h3>
                  <p style="color: #10b981; font-weight: bold;">Now ${sale.discountPercentage}% OFF!</p>
                  <a href="${process.env.NEXTAUTH_URL}/sales/${sale._id}" style="color: #8b5cf6;">View Sale →</a>
                </div>
              `).join('')}
              <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
                You're receiving this because you have price alerts enabled.
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
      message: `Sent ${emailsSent} price drop alerts`,
    });
  } catch (error) {
    console.error('Price drop notification error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send notifications' },
      { status: 500 }
    );
  }
}
