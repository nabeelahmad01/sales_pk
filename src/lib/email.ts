import nodemailer from 'nodemailer';

// Gmail SMTP Configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,        // your-email@gmail.com
    pass: process.env.GMAIL_APP_PASSWORD // 16-character app password
  }
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: `"ShowSales.pk" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html
    });
    
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
}

// Verify connection
export async function verifyEmailConnection() {
  try {
    await transporter.verify();
    console.log('Email server ready');
    return true;
  } catch (error) {
    console.error('Email server error:', error);
    return false;
  }
}
