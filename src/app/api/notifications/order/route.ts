import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

// POST - Send order confirmation email
export async function POST(request: NextRequest) {
  try {
    const { orderId, customerEmail, customerName, productName, totalAmount, paymentMethod } = await request.json();

    if (!customerEmail || !orderId) {
      return NextResponse.json(
        { success: false, error: 'Email and order ID are required' },
        { status: 400 }
      );
    }

    const paymentText = paymentMethod === 'cod' 
      ? 'Cash on Delivery' 
      : paymentMethod === 'jazzcash' 
        ? 'JazzCash' 
        : 'Credit/Debit Card';

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; }
          .header { background: linear-gradient(135deg, #8B5CF6, #EC4899); padding: 40px 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .header p { color: rgba(255,255,255,0.9); margin: 10px 0 0; }
          .content { padding: 40px 30px; }
          .order-box { background: #f8f4ff; border-radius: 12px; padding: 25px; margin: 25px 0; }
          .order-id { font-size: 24px; font-weight: bold; color: #8B5CF6; }
          .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; }
          .detail-row:last-child { border-bottom: none; }
          .detail-label { color: #666; }
          .detail-value { font-weight: 600; }
          .total-row { background: #8B5CF6; color: white; border-radius: 8px; padding: 15px 20px; margin-top: 20px; }
          .footer { background: #1E1B4B; color: rgba(255,255,255,0.7); padding: 30px; text-align: center; font-size: 14px; }
          .footer a { color: #8B5CF6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Order Confirmed!</h1>
            <p>Thank you for shopping with ShowSales.pk</p>
          </div>
          
          <div class="content">
            <p>Hi <strong>${customerName}</strong>,</p>
            <p>Great news! Your order has been confirmed and is being processed.</p>
            
            <div class="order-box">
              <p style="margin: 0 0 15px; color: #666;">Order Number</p>
              <p class="order-id">${orderId}</p>
            </div>
            
            <h3>Order Details</h3>
            
            <div class="detail-row">
              <span class="detail-label">Product</span>
              <span class="detail-value">${productName}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">Payment Method</span>
              <span class="detail-value">${paymentText}</span>
            </div>
            
            <div class="total-row">
              <div style="display: flex; justify-content: space-between;">
                <span>Total Amount</span>
                <span style="font-size: 20px; font-weight: bold;">Rs. ${totalAmount.toLocaleString()}</span>
              </div>
            </div>
            
            <p style="margin-top: 30px; color: #666;">
              You will receive another email when your order is shipped. If you have any questions, please contact us.
            </p>
          </div>
          
          <div class="footer">
            <p>🏷️ ShowSales.pk - Pakistan's Best Deals</p>
            <p>© ${new Date().getFullYear()} ShowSales.pk. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail({
      to: customerEmail,
      subject: `Order Confirmed - ${orderId} | ShowSales.pk`,
      html: emailHtml,
    });

    return NextResponse.json({
      success: true,
      message: 'Order confirmation email sent',
    });
  } catch (error: any) {
    console.error('Error sending order email:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}
