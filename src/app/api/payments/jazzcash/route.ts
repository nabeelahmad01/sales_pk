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

    // Prepare POST fields for JazzCash - Only include pp_ prefixed fields for hash
    // Use simplified data matching JazzCash sandbox requirements
    const postData: Record<string, string> = {
      pp_Amount: amountInPaisa,
      pp_BillReference: orderId,
      pp_Description: (productName || 'ShowSales Purchase').replace(/\s+/g, ''),
      pp_Language: 'EN',
      pp_MerchantID: merchantId,
      pp_Password: password,
      pp_ReturnURL: 'https://sales-pk.vercel.app/api/payments/jazzcash/callback',
      pp_TxnCurrency: 'PKR',
      pp_TxnDateTime: txnDateTime,
      pp_TxnExpiryDateTime: txnExpiryDateTime,
      pp_TxnRefNo: txnRefNo,
      pp_Version: '1.1',
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
  } catch (error: unknown) {
    console.error('JazzCash initiation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to initiate payment';
    return NextResponse.json(
      { success: false, error: errorMessage },
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
// EXACT format from JazzCash Hash Calculator:
// IntegritySalt&value1&value2&value3... (each value followed by &, last & removed)
// HMAC-SHA256 with integritySalt as key, output UPPERCASE
function generateSecureHash(data: Record<string, string>, integritySalt: string): string {
  // Get sorted keys (alphabetically) - only pp_ prefixed fields
  const sortedKeys = Object.keys(data)
    .filter(key => key.startsWith('pp_') && key !== 'pp_SecureHash')
    .sort();

  // Build string: IntegritySalt&value1&value2&...
  let finalString = integritySalt + '&';
  
  for (const key of sortedKeys) {
    const value = data[key];
    if (value !== undefined && value !== null && value !== '') {
      finalString += value + '&';
    }
  }
  
  // Remove the last '&'
  if (finalString.endsWith('&')) {
    finalString = finalString.slice(0, -1);
  }

  console.log('Hash Input String:', finalString);

  // Generate HMAC-SHA256 using integrity salt as key, output UPPERCASE
  const hash = crypto
    .createHmac('sha256', integritySalt)
    .update(finalString)
    .digest('hex')
    .toUpperCase();

  console.log('Generated Hash:', hash);

  return hash;
}
