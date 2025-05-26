import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import LiveStream from '@/models/LiveStream';
import UserStreamActivity from '@/models/UserStreamActivity';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
    try {
        // Verify user authentication
        const userId = request.headers.get('userId');
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Parse request body
        const body = await request.json();
        const { eventId, viewDuration = 0 } = body;

        if (!eventId) {
            return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
        }

        // Connect to database
        await connectToDatabase();

        // Check if the live stream exists
        const liveStream = await LiveStream.findById(eventId);
        if (!liveStream) {
            return NextResponse.json({ error: 'Live stream not found' }, { status: 404 });
        }

        // Increment the view count of the live stream
        await LiveStream.findByIdAndUpdate(
            eventId,
            { $inc: { viewCount: 1 } }
        );

        // Record the view activity
        await UserStreamActivity.create({
            userId,
            eventId: new mongoose.Types.ObjectId(eventId),
            activityType: 'view',
            viewDuration,
            timestamp: new Date(),
            interactionData: {
                movieTitle: liveStream.movieTitle,
                deviceInfo: request.headers.get('user-agent') || 'unknown'
            }
        });

        return NextResponse.json({
            success: true,
            message: 'View tracked successfully'
        });
    } catch (error) {
        console.error('Error tracking view:', error);
        return NextResponse.json({
            error: 'Failed to track view',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 