import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import PriceAlert from '@/models/PriceAlert';
import { authOptions } from '@/lib/auth';
import { applyRateLimit, rateLimits } from '@/lib/rateLimit';
import { validateEmail, validateNumber } from '@/lib/validation';

// GET user's price alerts
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Please login to view price alerts' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const alerts = await PriceAlert.find({ 
      userId: (session.user as any).id,
      isActive: true 
    })
      .populate('saleId', 'title image brandName discountPercentage')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: alerts });
  } catch (error) {
    console.error('Error fetching price alerts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch price alerts' },
      { status: 500 }
    );
  }
}

// POST create new price alert
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResponse = applyRateLimit(request, rateLimits.api);
    if (rateLimitResponse) return rateLimitResponse;

    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Please login to create price alerts' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const body = await request.json();
    const { saleId, targetPrice, currentPrice } = body;
    
    // Validation
    if (!saleId) {
      return NextResponse.json(
        { success: false, error: 'Sale ID is required' },
        { status: 400 }
      );
    }

    const priceValidation = validateNumber(targetPrice, { min: 0, name: 'Target price' });
    if (!priceValidation.valid) {
      return NextResponse.json(
        { success: false, error: priceValidation.errors.join(', ') },
        { status: 400 }
      );
    }

    // Check if alert already exists
    const existingAlert = await PriceAlert.findOne({
      userId: (session.user as any).id,
      saleId,
      isActive: true,
    });

    if (existingAlert) {
      // Update existing alert
      existingAlert.targetPrice = targetPrice;
      existingAlert.currentPrice = currentPrice;
      await existingAlert.save();
      
      return NextResponse.json({ 
        success: true, 
        data: existingAlert,
        message: 'Price alert updated!' 
      });
    }

    // Create new alert
    const alert = await PriceAlert.create({
      userId: (session.user as any).id,
      saleId,
      email: session.user.email || '',
      targetPrice,
      currentPrice,
    });

    return NextResponse.json(
      { success: true, data: alert, message: 'Price alert created!' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating price alert:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create price alert' },
      { status: 500 }
    );
  }
}

// DELETE a price alert
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Please login to delete price alerts' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const alertId = searchParams.get('id');

    if (!alertId) {
      return NextResponse.json(
        { success: false, error: 'Alert ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();
    
    const alert = await PriceAlert.findOneAndDelete({
      _id: alertId,
      userId: (session.user as any).id,
    });

    if (!alert) {
      return NextResponse.json(
        { success: false, error: 'Alert not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Price alert deleted!' 
    });
  } catch (error) {
    console.error('Error deleting price alert:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete price alert' },
      { status: 500 }
    );
  }
}
