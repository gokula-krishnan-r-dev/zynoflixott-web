import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
    try {
        // Verify user authentication
        const userId = request.headers.get('userId');
        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized. Please login to cancel subscription.' },
                { status: 401 }
            );
        }

        // Connect to database
        await connectToDatabase();

        // Get user subscription status
        const User = mongoose.models.User || (await import('@/models/User')).default;
        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Check if user has an active subscription
        if (!user.subscription || user.subscription.status !== 'active') {
            return NextResponse.json(
                { 
                    error: 'No active subscription found',
                    hasActiveSubscription: false
                },
                { status: 400 }
            );
        }

        // Update subscription status to canceled
        await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    isPremium: false,
                    'subscription.status': 'canceled',
                    'subscription.endDate': new Date() // Set end date to now
                }
            }
        );

        // Update subscription record in database
        await mongoose.connection.collection('subscriptions').updateOne(
            { 
                userId: new mongoose.Types.ObjectId(userId),
                status: 'active'
            },
            {
                $set: {
                    status: 'canceled',
                    canceledAt: new Date(),
                    updatedAt: new Date()
                }
            }
        );

        // Return success response
        return NextResponse.json({
            success: true,
            message: 'Subscription canceled successfully',
            subscription: {
                status: 'canceled',
                canceledAt: new Date()
            }
        });
    } catch (error: any) {
        console.error('Error canceling subscription:', error);
        return NextResponse.json(
            { 
                error: 'Failed to cancel subscription',
                details: error.message
            },
            { status: 500 }
        );
    }
}
