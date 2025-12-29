import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Subscriber from '@/models/Subscriber';
import { applyRateLimit, rateLimits } from '@/lib/rateLimit';
import { validateEmail } from '@/lib/validation';

// GET all subscribers
export async function GET() {
  try {
    await dbConnect();
    
    const subscribers = await Subscriber.find().sort({ subscribedAt: -1 });
    
    return NextResponse.json({ success: true, data: subscribers });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subscribers' },
      { status: 500 }
    );
  }
}

// POST new subscriber
export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = applyRateLimit(request, rateLimits.subscribe);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    await dbConnect();
    
    const { email } = await request.json();
    
    // Validate email
    const validation = validateEmail(email);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.errors.join(', ') },
        { status: 400 }
      );
    }
    
    const normalizedEmail = email.trim().toLowerCase();
    
    // Check if already subscribed
    const existing = await Subscriber.findOne({ email: normalizedEmail });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Email already subscribed' },
        { status: 400 }
      );
    }
    
    const subscriber = await Subscriber.create({ email: normalizedEmail });
    
    return NextResponse.json({ success: true, data: subscriber }, { status: 201 });
  } catch (error) {
    console.error('Error creating subscriber:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}
