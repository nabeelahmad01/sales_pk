import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Sale from '@/models/Sale';

// POST - increment view count
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { saleId } = await request.json();
    
    if (!saleId) {
      return NextResponse.json(
        { success: false, error: 'Sale ID is required' },
        { status: 400 }
      );
    }

    const sale = await Sale.findByIdAndUpdate(
      saleId,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!sale) {
      return NextResponse.json(
        { success: false, error: 'Sale not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { views: sale.views },
    });
  } catch (error) {
    console.error('Error incrementing views:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update views' },
      { status: 500 }
    );
  }
}
