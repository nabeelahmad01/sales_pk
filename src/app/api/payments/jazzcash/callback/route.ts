import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

// Handle JazzCash payment callback (POST from JazzCash)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract JazzCash response fields
    const responseCode = formData.get('pp_ResponseCode') as string;
    const responseMessage = formData.get('pp_ResponseMessage') as string;
    const txnRefNo = formData.get('pp_TxnRefNo') as string;
    const billReference = formData.get('pp_BillReference') as string; // This is our orderId
    const retrievalRefNo = formData.get('pp_RetreivalReferenceNo') as string;
    const amount = formData.get('pp_Amount') as string;

    console.log('JazzCash Callback:', {
      responseCode,
      responseMessage,
      txnRefNo,
      billReference,
      retrievalRefNo,
      amount,
    });

    // Update order payment status in database
    if (billReference) {
      await dbConnect();
      
      const paymentStatus = responseCode === '000' ? 'paid' : 'failed';
      
      await Order.findOneAndUpdate(
        { orderId: billReference },
        {
          paymentStatus: paymentStatus,
          transactionId: txnRefNo,
          paymentId: retrievalRefNo,
          adminNotes: `JazzCash: ${responseMessage}`,
        }
      );
    }

    // Redirect to appropriate page based on payment status
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    
    if (responseCode === '000') {
      // Payment successful
      return NextResponse.redirect(
        `${baseUrl}/payment/success?orderId=${billReference}&txn=${txnRefNo}`
      );
    } else {
      // Payment failed
      return NextResponse.redirect(
        `${baseUrl}/payment/failed?orderId=${billReference}&error=${encodeURIComponent(responseMessage || 'Payment failed')}`
      );
    }
  } catch (error: any) {
    console.error('JazzCash callback error:', error);
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    return NextResponse.redirect(
      `${baseUrl}/payment/failed?error=${encodeURIComponent('An error occurred processing your payment')}`
    );
  }
}

// Handle GET requests (for testing or direct access)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const responseCode = searchParams.get('pp_ResponseCode');
  const billReference = searchParams.get('pp_BillReference');
  const txnRefNo = searchParams.get('pp_TxnRefNo');
  const responseMessage = searchParams.get('pp_ResponseMessage');

  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  if (billReference) {
    await dbConnect();
    
    const paymentStatus = responseCode === '000' ? 'paid' : 'failed';
    
    await Order.findOneAndUpdate(
      { orderId: billReference },
      {
        paymentStatus: paymentStatus,
        transactionId: txnRefNo,
      }
    );
  }

  if (responseCode === '000') {
    return NextResponse.redirect(
      `${baseUrl}/payment/success?orderId=${billReference}&txn=${txnRefNo}`
    );
  } else {
    return NextResponse.redirect(
      `${baseUrl}/payment/failed?orderId=${billReference}&error=${encodeURIComponent(responseMessage || 'Payment failed')}`
    );
  }
}
