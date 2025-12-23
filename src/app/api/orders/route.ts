import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

// GET - List orders
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get('brandId');
    const brandName = searchParams.get('brandName');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    const query: any = {};
    
    // Support both brandId and brandName filtering
    if (brandId) {
      query.brandId = brandId;
    }
    
    if (brandName) {
      query.brandName = { $regex: new RegExp(brandName, 'i') };
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);

    return NextResponse.json({
      success: true,
      data: orders,
    });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST - Create new order
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      customerCity,
      saleId,
      brandId,
      brandName,
      productName,
      productImage,
      quantity,
      unitPrice,
      totalAmount,
      paymentMethod,
      customerNotes,
    } = body;

    // Validation
    if (!customerName || !customerEmail || !customerPhone || !customerAddress || !customerCity) {
      return NextResponse.json(
        { success: false, error: 'Customer information is required' },
        { status: 400 }
      );
    }

    if (!saleId || !brandId || !productName || !unitPrice || !totalAmount) {
      return NextResponse.json(
        { success: false, error: 'Product information is required' },
        { status: 400 }
      );
    }

    if (!paymentMethod) {
      return NextResponse.json(
        { success: false, error: 'Payment method is required' },
        { status: 400 }
      );
    }

    // Generate order ID
    const date = new Date();
    const prefix = 'SS';
    const timestamp = date.getFullYear().toString().slice(-2) + 
                     (date.getMonth() + 1).toString().padStart(2, '0') + 
                     date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const orderId = `${prefix}${timestamp}${random}`;

    const order = await Order.create({
      orderId,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      customerCity,
      saleId,
      brandId,
      brandName,
      productName,
      productImage,
      quantity: quantity || 1,
      unitPrice,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      status: 'pending',
      customerNotes,
    });

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
