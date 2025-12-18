import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Sale from '@/models/Sale';

// GET single sale
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const sale = await Sale.findById(id);
    
    if (!sale) {
      return NextResponse.json(
        { success: false, error: 'Sale not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: sale });
  } catch (error) {
    console.error('Error fetching sale:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sale' },
      { status: 500 }
    );
  }
}

// PUT update sale
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const body = await request.json();
    const sale = await Sale.findByIdAndUpdate(id, body, { new: true });
    
    if (!sale) {
      return NextResponse.json(
        { success: false, error: 'Sale not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: sale });
  } catch (error) {
    console.error('Error updating sale:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update sale' },
      { status: 500 }
    );
  }
}

// DELETE sale
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const sale = await Sale.findByIdAndDelete(id);
    
    if (!sale) {
      return NextResponse.json(
        { success: false, error: 'Sale not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, message: 'Sale deleted successfully' });
  } catch (error) {
    console.error('Error deleting sale:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete sale' },
      { status: 500 }
    );
  }
}
