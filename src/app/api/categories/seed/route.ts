import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';
import Sale from '@/models/Sale';
import Brand from '@/models/Brand';

// Seed default categories if none exist
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // Check if categories already exist
    const existingCount = await Category.countDocuments();
    if (existingCount > 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Categories already seeded',
        count: existingCount 
      });
    }

    // Default categories
    const defaultCategories = [
      { name: 'Clothing', slug: 'clothing', icon: '👕', description: 'Men & Women Clothing' },
      { name: 'Shoes', slug: 'shoes', icon: '👟', description: 'Footwear & Sneakers' },
      { name: 'Accessories', slug: 'accessories', icon: '👜', description: 'Bags, Watches & More' },
      { name: 'Kids', slug: 'kids', icon: '🧸', description: 'Kids Fashion' },
      { name: 'Sports', slug: 'sports', icon: '⚽', description: 'Sports & Fitness' },
      { name: 'Beauty', slug: 'beauty', icon: '💄', description: 'Beauty & Personal Care' },
    ];

    const categories = await Category.insertMany(defaultCategories);

    // Update sales count for each category
    for (const cat of categories) {
      const count = await Sale.countDocuments({ 
        category: { $regex: new RegExp(`^${cat.name}$`, 'i') },
        isActive: true 
      });
      await Category.findByIdAndUpdate(cat._id, { salesCount: count });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Categories seeded successfully',
      data: categories 
    }, { status: 201 });
  } catch (error) {
    console.error('Error seeding categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed categories' },
      { status: 500 }
    );
  }
}
