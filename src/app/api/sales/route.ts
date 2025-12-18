import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Sale from '@/models/Sale';

// GET all sales
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const featured = searchParams.get('featured');
    const active = searchParams.get('active');
    
    // Build query
    const query: any = {};
    if (category && category !== 'all') query.category = category;
    if (brand && brand !== 'all') query.brandId = brand;
    if (featured === 'true') query.isFeatured = true;
    if (active === 'true') query.isActive = true;
    
    const sales = await Sale.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: sales });
  } catch (error) {
    console.error('Error fetching sales:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sales' },
      { status: 500 }
    );
  }
}

// POST new sale
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const sale = await Sale.create(body);
    
    return NextResponse.json({ success: true, data: sale }, { status: 201 });
  } catch (error) {
    console.error('Error creating sale:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create sale' },
      { status: 500 }
    );
  }
}
