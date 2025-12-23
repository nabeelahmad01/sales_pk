import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import User from '@/models/User';
import { authOptions } from '@/lib/auth';

// POST - Subscribe to WhatsApp alerts
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    const { phone, name } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { success: false, error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Validate Pakistani phone number
    const phoneRegex = /^(\+92|0)?3[0-9]{9}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid Pakistani phone number' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Store WhatsApp subscription
    // In a real app, you'd use WhatsApp Business API
    // For now, we'll store it in a simple collection
    
    const whatsappData = {
      phone: phone.replace(/\s/g, ''),
      name: name || 'Anonymous',
      userId: session?.user ? (session.user as any).id : null,
      createdAt: new Date(),
    };

    // Here you would integrate with WhatsApp Business API
    // For demo, we'll just return success
    console.log('WhatsApp subscription:', whatsappData);

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to WhatsApp alerts!',
      // In production, this would send a WhatsApp message to confirm
    });
  } catch (error) {
    console.error('WhatsApp subscription error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}
