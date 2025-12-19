import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Sale from '@/models/Sale';
import Brand from '@/models/Brand';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    
    if (!query || query.length < 2) {
      return NextResponse.json({ 
        success: true, 
        data: { sales: [], brands: [] } 
      });
    }
    
    // Search sales
    const sales = await Sale.find({
      isActive: true,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { brandName: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
      ]
    }).limit(10);
    
    // Search brands
    const brands = await Brand.find({
      isActive: true,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
      ]
    }).limit(5);
    
    return NextResponse.json({ 
      success: true, 
      data: { sales, brands } 
    });
  } catch (error) {
    console.error('Error searching:', error);
    return NextResponse.json(
      { success: false, error: 'Search failed' },
      { status: 500 }
    );
  }
}
