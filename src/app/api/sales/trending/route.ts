import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Sale from '@/models/Sale';

// GET - fetch trending sales (sorted by views and saves)
export async function GET() {
  try {
    await dbConnect();

    // Get trending sales - combined score of views and saves
    const trendingSales = await Sale.find({ isActive: true })
      .sort({ views: -1, savesCount: -1 })
      .limit(8);

    // Get most saved sales
    const mostSaved = await Sale.find({ isActive: true })
      .sort({ savesCount: -1 })
      .limit(4);

    // Get ending soon sales (within 3 days)
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    
    const endingSoon = await Sale.find({
      isActive: true,
      endDate: { $gte: new Date(), $lte: threeDaysFromNow },
    })
      .sort({ endDate: 1 })
      .limit(4);

    return NextResponse.json({
      success: true,
      data: {
        trending: trendingSales,
        mostSaved,
        endingSoon,
      },
    });
  } catch (error) {
    console.error('Error fetching trending sales:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch trending sales' },
      { status: 500 }
    );
  }
}
