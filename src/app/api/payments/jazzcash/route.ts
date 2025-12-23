import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// JazzCash payment initiation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, orderId, customerEmail, customerPhone, productName } = body;

    // Validate required fields
    if (!amount || !orderId) {
      return NextResponse.json(
        { success: false, error: 'Amount and Order ID are required' },
        { status: 400 }
      );
    }

    // JazzCash credentials from environment
    const merchantId = process.env.JAZZCASH_MERCHANT_ID;
    const password = process.env.JAZZCASH_PASSWORD;
    const integritySalt = process.env.JAZZCASH_INTEGRITY_SALT;
    const sandboxUrl = process.env.JAZZCASH_SANDBOX_URL;

    if (!merchantId || !password || !integritySalt) {
      return NextResponse.json(
        { success: false, error: 'JazzCash credentials not configured' },
        { status: 500 }
      );
    }

    // Get the base URL - for localhost testing, JazzCash sandbox may not work
    // In production, use your actual domain
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const returnUrl = `${baseUrl}/api/payments/jazzcash/callback`;

    // Generate transaction reference and date/time
    const txnRefNo = `T${Date.now()}`;
    const now = new Date();
    const txnDateTime = formatDateTime(now);
    
    // Expiry time (1 hour from now)
    const expiry = new Date(now.getTime() + 60 * 60 * 1000);
    const txnExpiryDateTime = formatDateTime(expiry);

    // Amount in paisa (multiply by 100)
    const amountInPaisa = Math.round(amount * 100).toString();

    // Prepare POST fields for JazzCash - IMPORTANT: These must match hash generation order
    const postData: Record<string, string> = {
      pp_Amount: amountInPaisa,
      pp_BankID: '',
      pp_BillReference: orderId,
      pp_Description: productName || 'Purchase from ShowSales.pk',
      pp_Language: 'EN',
      pp_MerchantID: merchantId,
      pp_Password: password,
      pp_ProductID: '',
      pp_ReturnURL: returnUrl,
      pp_SubMerchantID: '',
      pp_TxnCurrency: 'PKR',
      pp_TxnDateTime: txnDateTime,
      pp_TxnExpiryDateTime: txnExpiryDateTime,
      pp_TxnRefNo: txnRefNo,
      pp_TxnType: 'MWALLET',
      pp_Version: '1.1',
      ppmpf_1: customerEmail || '',
      ppmpf_2: customerPhone || '',
      ppmpf_3: '',
      ppmpf_4: '',
      ppmpf_5: '',
    };

    // Generate secure hash
    const secureHash = generateSecureHash(postData, integritySalt);
    postData.pp_SecureHash = secureHash;

    return NextResponse.json({
      success: true,
      data: {
        paymentUrl: sandboxUrl,
        postData: postData,
        txnRefNo: txnRefNo,
      },
    });
  } catch (error: any) {
    console.error('JazzCash initiation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to initiate payment' },
      { status: 500 }
    );
  }
}

// Format date time for JazzCash (YYYYMMDDHHmmss)
function formatDateTime(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

// Generate HMAC-SHA256 secure hash for JazzCash
// JazzCash requires: IntegritySalt + & + sorted non-empty field values joined by &
function generateSecureHash(data: Record<string, string>, integritySalt: string): string {
  // Get all keys that start with pp_ and have non-empty values (exclude SecureHash)
  const sortedKeys = Object.keys(data)
    .filter(key => key.startsWith('pp') && data[key] !== '' && key !== 'pp_SecureHash')
    .sort();
  
  // Build the string: IntegritySalt&value1&value2&... (values in alphabetical key order)
  const hashString = integritySalt + '&' + sortedKeys
    .map(key => data[key])
    .join('&');
  
  console.log('Hash String:', hashString); // Debug log
  
  // Generate HMAC-SHA256 hash
  const hash = crypto
    .createHmac('sha256', integritySalt)
    .update(hashString)
    .digest('hex')
    .toUpperCase();
  
  return hash;
}
