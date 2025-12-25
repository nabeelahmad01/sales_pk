import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';

interface Params {
  params: Promise<{ slug: string }>;
}

// GET single post by slug
export async function GET(request: NextRequest, { params }: Params) {
  try {
    await dbConnect();
    const { slug } = await params;
    
    const post = await Post.findOne({ slug });
    
    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Increment views
    await Post.findByIdAndUpdate(post._id, { $inc: { views: 1 } });
    
    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

// PUT update post
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    await dbConnect();
    const { slug } = await params;
    
    const body = await request.json();
    
    // Set published date if publishing for first time
    if (body.isPublished && !body.publishedAt) {
      body.publishedAt = new Date();
    }
    
    const post = await Post.findOneAndUpdate(
      { slug },
      body,
      { new: true, runValidators: true }
    );
    
    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE post
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    await dbConnect();
    const { slug } = await params;
    
    const post = await Post.findOneAndDelete({ slug });
    
    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, message: 'Post deleted' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
