import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// GET user's favorites
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user.favorites,
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch favorites' },
      { status: 500 }
    );
  }
}

// POST - Add to favorites
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { saleId } = await request.json();
    
    if (!saleId) {
      return NextResponse.json(
        { success: false, error: 'Sale ID required' },
        { status: 400 }
      );
    }

    await dbConnect();
    
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { $addToSet: { favorites: saleId } },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Added to favorites',
      data: user?.favorites,
    });
  } catch (error) {
    console.error('Error adding favorite:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add favorite' },
      { status: 500 }
    );
  }
}

// DELETE - Remove from favorites
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { saleId } = await request.json();
    
    if (!saleId) {
      return NextResponse.json(
        { success: false, error: 'Sale ID required' },
        { status: 400 }
      );
    }

    await dbConnect();
    
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { $pull: { favorites: saleId } },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Removed from favorites',
      data: user?.favorites,
    });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove favorite' },
      { status: 500 }
    );
  }
}
