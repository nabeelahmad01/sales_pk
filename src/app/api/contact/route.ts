import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Contact from '@/models/Contact';
import { applyRateLimit, rateLimits } from '@/lib/rateLimit';
import { validateContact, sanitizeString } from '@/lib/validation';

// GET all contact submissions (for admin)
export async function GET() {
  try {
    await dbConnect();
    
    const contacts = await Contact.find().sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: contacts });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}

// POST new contact submission
export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = applyRateLimit(request, rateLimits.contact);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    await dbConnect();
    
    const body = await request.json();
    
    // Validate input
    const validation = validateContact(body);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.errors.join(', ') },
        { status: 400 }
      );
    }
    
    // Sanitize inputs
    const contact = await Contact.create({
      name: sanitizeString(body.name.trim()),
      email: body.email.trim().toLowerCase(),
      subject: sanitizeString(body.subject.trim()),
      message: sanitizeString(body.message.trim()),
    });
    
    return NextResponse.json(
      { success: true, data: contact, message: 'Message sent successfully!' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
