import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Brand from '@/models/Brand';

// POST - Bulk import brands
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { brands } = await request.json();
    
    if (!brands || !Array.isArray(brands) || brands.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No brands data provided' },
        { status: 400 }
      );
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    const requiredFields = ['name', 'logo', 'category'];

    for (const brandData of brands) {
      try {
        // Validate required fields
        const missingFields = requiredFields.filter(field => !brandData[field]);
        if (missingFields.length > 0) {
          results.failed++;
          results.errors.push(`${brandData.name || 'Unknown'}: Missing fields - ${missingFields.join(', ')}`);
          continue;
        }

        // Generate slug if not provided
        const slug = brandData.slug || brandData.name.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

        // Check if brand with same slug exists
        const existing = await Brand.findOne({ slug });
        
        if (existing) {
          // Update existing brand
          await Brand.findByIdAndUpdate(existing._id, {
            name: brandData.name,
            logo: brandData.logo,
            description: brandData.description || '',
            website: brandData.website || '',
            category: brandData.category,
            isActive: brandData.isActive !== false,
          });
          results.success++;
        } else {
          // Create new brand
          await Brand.create({
            name: brandData.name,
            slug,
            logo: brandData.logo,
            description: brandData.description || '',
            website: brandData.website || '',
            category: brandData.category,
            isActive: brandData.isActive !== false,
          });
          results.success++;
        }
      } catch (error: any) {
        results.failed++;
        results.errors.push(`${brandData.name || 'Unknown'}: ${error.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Import complete! ${results.success} brands imported, ${results.failed} failed.`,
      results,
    });
  } catch (error: any) {
    console.error('Error importing brands:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to import brands' },
      { status: 500 }
    );
  }
}
