import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Sale from '@/models/Sale';

// GET - Auto deactivate expired sales
export async function GET() {
  try {
    await dbConnect();
    
    const now = new Date();
    
    // Find all expired but still active sales
    const result = await Sale.updateMany(
      { 
        endDate: { $lt: now },
        isActive: true 
      },
      { 
        $set: { isActive: false } 
      }
    );
    
    return NextResponse.json({ 
      success: true, 
      message: `Deactivated ${result.modifiedCount} expired sales`,
      data: { deactivatedCount: result.modifiedCount }
    });
  } catch (error) {
    console.error('Error cleaning up expired sales:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to cleanup expired sales' },
      { status: 500 }
    );
  }
}

// POST - Same functionality, for cron job support
export async function POST() {
  return GET();
}
