import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { sendEmail } from '@/lib/email';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// Send verification email
async function sendVerificationEmail(email: string, token: string, name: string) {
  const verifyUrl = `${process.env.NEXTAUTH_URL || 'https://sales-pk.vercel.app'}/verify-email?token=${token}`;
  
  await sendEmail({
    to: email,
    subject: 'Verify Your Email - ShowSales.pk',
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
              <h2>Welcome to ShowSales.pk! 🎉</h2>
              <p>Hi ${name},</p>
              <p>Thank you for signing up! Please verify your email address to start discovering the best sales in Pakistan.</p>
              <p style="text-align: center;">
                <a href="${verifyUrl}" class="btn">Verify Email</a>
              </p>
              <p>If you didn't create an account, you can safely ignore this email.</p>
            </div>
            <div class="footer">
              <p>© 2024 ShowSales.pk - Never Miss a Sale Again!</p>
            </div>
          </div>
        </body>
      </html>
    `,
  });
}

// POST - Send verification email
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

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.isEmailVerified) {
      return NextResponse.json({
        success: true,
        message: 'Email already verified',
      });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Save token to user
    await User.findByIdAndUpdate(user._id, {
      emailVerificationToken: verificationToken,
    });

    // Send email
    await sendVerificationEmail(email, verificationToken, user.name);

    return NextResponse.json({
      success: true,
      message: 'Verification email sent',
    });
  } catch (error) {
    console.error('Send verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send verification email' },
      { status: 500 }
    );
  }
}

// GET - Verify email with token
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token is required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ emailVerificationToken: token });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    // Mark email as verified
    await User.findByIdAndUpdate(user._id, {
      isEmailVerified: true,
      emailVerificationToken: undefined,
    });

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (error) {
    console.error('Verify email error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify email' },
      { status: 500 }
    );
  }
}
