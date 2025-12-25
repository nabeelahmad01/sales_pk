import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Sale from '@/models/Sale';

// POST - Track click on shop now / visit store
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
    
    // Increment affiliate clicks
    const sale = await Sale.findByIdAndUpdate(
      saleId,
      { $inc: { affiliateClicks: 1 } },
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
      data: { clicks: sale.affiliateClicks } 
    });
  } catch (error) {
    console.error('Error tracking click:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track click' },
      { status: 500 }
    );
  }
}
