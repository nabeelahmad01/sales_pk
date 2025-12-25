import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { sendEmail } from '@/lib/email';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

async function sendPasswordResetEmail(email: string, token: string, name: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL || 'https://sales-pk.vercel.app'}/reset-password?token=${token}`;
  
  await sendEmail({
    to: email,
    subject: 'Reset Your Password - ShowSales.pk',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 20px 0; }
            .logo { font-size: 28px; font-weight: bold; color: #8b5cf6; }
            .content { background: #f9fafb; padding: 30px; border-radius: 12px; }
            .btn { display: inline-block; background: linear-gradient(135deg, #8b5cf6, #ec4899); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🏷️ ShowSales.pk</div>
            </div>
            <div class="content">
              <h2>Password Reset Request</h2>
              <p>Hi ${name || 'there'},</p>
              <p>We received a request to reset your password. Click the button below to create a new password:</p>
              <p style="text-align: center;">
                <a href="${resetUrl}" class="btn">Reset Password</a>
              </p>
              <p><strong>This link will expire in 1 hour.</strong></p>
              <p>If you didn't request this password reset, you can safely ignore this email.</p>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
              <p style="font-size: 12px; color: #6b7280;">If the button doesn't work, copy and paste this URL into your browser:</p>
              <p style="font-size: 12px; word-break: break-all; color: #8b5cf6;">${resetUrl}</p>
            </div>
            <div class="footer">
              <p>© 2024 ShowSales.pk - Pakistan's #1 Sale Aggregator</p>
            </div>
          </div>
        </body>
      </html>
    `,
  });
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If an account exists, a reset link has been sent',
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save token to user
    await User.findByIdAndUpdate(user._id, {
      resetToken: resetTokenHash,
      resetTokenExpiry,
    });

    // Send email
    await sendPasswordResetEmail(email, resetToken, user.name);

    return NextResponse.json({
      success: true,
      message: 'If an account exists, a reset link has been sent',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
