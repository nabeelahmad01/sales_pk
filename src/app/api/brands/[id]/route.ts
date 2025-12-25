import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Brand from '@/models/Brand';
import mongoose from 'mongoose';

// GET single brand by ID or slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    
    let brand = null;
    
    // Check if it's a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      brand = await Brand.findById(id);
    }
    
    // If not found by ID, try finding by slug
    if (!brand) {
      brand = await Brand.findOne({ slug: id });
    }
    
    if (!brand) {
      return NextResponse.json(
        { success: false, error: 'Brand not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: brand });
  } catch (error) {
    console.error('Error fetching brand:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch brand' },
      { status: 500 }
    );
  }
}


// PUT update brand
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const body = await request.json();
    
    // Update slug if name changed
    if (body.name) {
      body.slug = body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    
    // Set approvedAt when status is approved
    if (body.status === 'approved') {
      body.approvedAt = new Date();
    }
    
    const brand = await Brand.findByIdAndUpdate(id, body, { new: true });
    
    if (!brand) {
      return NextResponse.json(
        { success: false, error: 'Brand not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: brand });
  } catch (error) {
    console.error('Error updating brand:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update brand' },
      { status: 500 }
    );
  }
}

// DELETE brand
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const brand = await Brand.findByIdAndDelete(id);
    
    if (!brand) {
      return NextResponse.json(
        { success: false, error: 'Brand not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, message: 'Brand deleted successfully' });
  } catch (error) {
    console.error('Error deleting brand:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete brand' },
      { status: 500 }
    );
  }
}
