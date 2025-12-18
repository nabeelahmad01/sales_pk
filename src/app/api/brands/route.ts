import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Brand from '@/models/Brand';

// GET all brands
export async function GET() {
  try {
    await dbConnect();
    
    const brands = await Brand.find({ isActive: true }).sort({ name: 1 });
    
    return NextResponse.json({ success: true, data: brands });
  } catch (error) {
    console.error('Error fetching brands:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch brands' },
      { status: 500 }
    );
  }
}

// POST new brand
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    // Generate slug from name
    body.slug = body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    const brand = await Brand.create(body);
    
    return NextResponse.json({ success: true, data: brand }, { status: 201 });
  } catch (error) {
    console.error('Error creating brand:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create brand' },
      { status: 500 }
    );
  }
}
