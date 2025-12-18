import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Subscriber from '@/models/Subscriber';

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
    await dbConnect();
    
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Check if already subscribed
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Email already subscribed' },
        { status: 400 }
      );
    }
    
    const subscriber = await Subscriber.create({ email });
    
    return NextResponse.json({ success: true, data: subscriber }, { status: 201 });
  } catch (error) {
    console.error('Error creating subscriber:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}
