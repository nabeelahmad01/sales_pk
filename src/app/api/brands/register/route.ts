import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Brand from '@/models/Brand';
import bcrypt from 'bcryptjs';

// POST - Register new brand
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { name, email, password, contactPerson, contactPhone, website, category, description } = body;
    
    // Validation
    if (!name || !email || !password || !contactPerson || !contactPhone || !category) {
      return NextResponse.json(
        { success: false, error: 'Please fill all required fields' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingBrand = await Brand.findOne({ email });
    if (existingBrand) {
      return NextResponse.json(
        { success: false, error: 'A brand with this email already exists' },
        { status: 400 }
      );
    }

    // Check if brand name already exists
    const existingName = await Brand.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existingName) {
      return NextResponse.json(
        { success: false, error: 'A brand with this name already exists' },
        { status: 400 }
      );
    }

    // Generate slug
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug exists
    const existingSlug = await Brand.findOne({ slug });
    if (existingSlug) {
      return NextResponse.json(
        { success: false, error: 'Brand name is too similar to an existing brand' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create brand with pending status
    const brand = await Brand.create({
      name,
      slug,
      email,
      password: hashedPassword,
      contactPerson,
      contactPhone,
      website: website || '',
      category,
      description: description || '',
      logo: '/images/placeholder-logo.png', // Default logo, brand can update later
      isActive: false, // Not active until approved
      status: 'pending',
    });

    return NextResponse.json({
      success: true,
      message: 'Brand registration submitted successfully! Please wait for admin approval.',
      data: {
        id: brand._id,
        name: brand.name,
        email: brand.email,
        status: brand.status,
      },
    });
  } catch (error: any) {
    console.error('Error registering brand:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to register brand' },
      { status: 500 }
    );
  }
}
