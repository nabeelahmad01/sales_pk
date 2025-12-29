import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import Coupon from '@/models/Coupon';
import { authOptions } from '@/lib/auth';
import { applyRateLimit, rateLimits } from '@/lib/rateLimit';

// GET all coupons (admin) or validate a coupon code (public)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    
    // If code is provided, validate it (public endpoint)
    if (code) {
      const coupon = await Coupon.findOne({ 
        code: code.toUpperCase(),
        isActive: true,
        startDate: { $lte: new Date() },
        endDate: { $gte: new Date() },
      });

      if (!coupon) {
        return NextResponse.json(
          { success: false, error: 'Invalid or expired coupon code' },
          { status: 404 }
        );
      }

      // Check usage limit
      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        return NextResponse.json(
          { success: false, error: 'Coupon usage limit reached' },
          { status: 400 }
        );
      }

      return NextResponse.json({ 
        success: true, 
        data: {
          code: coupon.code,
          description: coupon.description,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          minPurchase: coupon.minPurchase,
          maxDiscount: coupon.maxDiscount,
        }
      });
    }
    
    // List all coupons (admin only)
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }
    
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: coupons });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch coupons' },
      { status: 500 }
    );
  }
}

// POST create new coupon (admin only)
export async function POST(request: NextRequest) {
  try {
    const rateLimitResponse = applyRateLimit(request, rateLimits.api);
    if (rateLimitResponse) return rateLimitResponse;

    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    await dbConnect();
    
    const body = await request.json();
    
    // Validation
    if (!body.code || !body.description || !body.discountType || body.discountValue === undefined) {
      return NextResponse.json(
        { success: false, error: 'Code, description, discount type, and discount value are required' },
        { status: 400 }
      );
    }

    if (!body.startDate || !body.endDate) {
      return NextResponse.json(
        { success: false, error: 'Start date and end date are required' },
        { status: 400 }
      );
    }

    // Check if code already exists
    const existingCoupon = await Coupon.findOne({ code: body.code.toUpperCase() });
    if (existingCoupon) {
      return NextResponse.json(
        { success: false, error: 'Coupon code already exists' },
        { status: 400 }
      );
    }

    const coupon = await Coupon.create({
      ...body,
      code: body.code.toUpperCase(),
      createdBy: session.user.email,
    });

    return NextResponse.json(
      { success: true, data: coupon, message: 'Coupon created successfully!' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating coupon:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create coupon' },
      { status: 500 }
    );
  }
}

// PUT update coupon (admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    await dbConnect();
    
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Coupon ID is required' },
        { status: 400 }
      );
    }

    const coupon = await Coupon.findByIdAndUpdate(
      id,
      { ...updateData, code: updateData.code?.toUpperCase() },
      { new: true }
    );

    if (!coupon) {
      return NextResponse.json(
        { success: false, error: 'Coupon not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: coupon,
      message: 'Coupon updated successfully!' 
    });
  } catch (error) {
    console.error('Error updating coupon:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update coupon' },
      { status: 500 }
    );
  }
}

// DELETE coupon (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Coupon ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();
    
    const coupon = await Coupon.findByIdAndDelete(id);

    if (!coupon) {
      return NextResponse.json(
        { success: false, error: 'Coupon not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Coupon deleted successfully!' 
    });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete coupon' },
      { status: 500 }
    );
  }
}

// POST apply coupon (increase usage count)
export async function PATCH(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Coupon code is required' },
        { status: 400 }
      );
    }

    const coupon = await Coupon.findOneAndUpdate(
      { 
        code: code.toUpperCase(),
        isActive: true,
        startDate: { $lte: new Date() },
        endDate: { $gte: new Date() },
      },
      { $inc: { usedCount: 1 } },
      { new: true }
    );

    if (!coupon) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired coupon' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Coupon applied successfully!' 
    });
  } catch (error) {
    console.error('Error applying coupon:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to apply coupon' },
      { status: 500 }
    );
  }
}
