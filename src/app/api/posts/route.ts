import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';

// GET all posts
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');
    const limit = searchParams.get('limit');
    const category = searchParams.get('category');
    
    // Build query
    const query: any = {};
    if (published === 'true') query.isPublished = true;
    if (category) query.category = category;
    
    let postsQuery = Post.find(query).sort({ publishedAt: -1, createdAt: -1 });
    
    if (limit) {
      postsQuery = postsQuery.limit(parseInt(limit));
    }
    
    const posts = await postsQuery;
    
    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST create new post
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    // Set published date if publishing
    if (body.isPublished && !body.publishedAt) {
      body.publishedAt = new Date();
    }
    
    const post = await Post.create(body);
    
    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating post:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'A post with this slug already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
