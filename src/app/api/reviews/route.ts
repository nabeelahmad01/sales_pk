import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';
import { authOptions } from '@/lib/auth';

// GET - Get reviews for a brand
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get('brandId');
    
    if (!brandId) {
      return NextResponse.json(
        { success: false, error: 'Brand ID is required' },
        { status: 400 }
      );
    }

    const reviews = await Review.find({ brandId })
      .sort({ createdAt: -1 })
      .limit(20);

    // Calculate average rating
    const avgRating = reviews.length > 0 
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length 
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        reviews,
        averageRating: Math.round(avgRating * 10) / 10,
        totalReviews: reviews.length,
      },
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST - Create a new review
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Please login to submit a review' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const { brandId, brandName, rating, title, content } = await request.json();

    if (!brandId || !rating || !title || !content) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if user already reviewed this brand
    const existingReview = await Review.findOne({ 
      userId: (session.user as any).id, 
      brandId 
    });

    if (existingReview) {
      return NextResponse.json(
        { success: false, error: 'You have already reviewed this brand' },
        { status: 400 }
      );
    }

    const review = await Review.create({
      userId: (session.user as any).id,
      userName: session.user.name || 'Anonymous',
      brandId,
      brandName,
      rating: Math.min(5, Math.max(1, rating)),
      title,
      content,
    });

    return NextResponse.json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create review' },
      { status: 500 }
    );
  }
}
