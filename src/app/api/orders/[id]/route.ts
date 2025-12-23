import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET - Get single order
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await dbConnect();
    const { id } = await context.params;
    
    const order = await Order.findById(id);
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// PUT - Update order
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await dbConnect();
    const { id } = await context.params;
    
    const body = await request.json();
    const { status, paymentStatus, adminNotes, transactionId } = body;

    const updateData: any = {};
    
    if (status) {
      updateData.status = status;
      // Set timestamp based on status
      if (status === 'confirmed') updateData.confirmedAt = new Date();
      if (status === 'shipped') updateData.shippedAt = new Date();
      if (status === 'delivered') updateData.deliveredAt = new Date();
      if (status === 'cancelled') updateData.cancelledAt = new Date();
    }
    
    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }
    
    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }
    
    if (transactionId) {
      updateData.transactionId = transactionId;
    }

    const order = await Order.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      data: order,
    });
  } catch (error: any) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update order' },
      { status: 500 }
    );
  }
}

// DELETE - Delete order
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await dbConnect();
    const { id } = await context.params;
    
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete order' },
      { status: 500 }
    );
  }
}
