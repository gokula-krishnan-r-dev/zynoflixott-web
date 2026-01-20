import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongo';
import { ObjectId } from 'mongodb';
import connectToDatabase from '@/lib/mongodb';
import mongoose from 'mongoose';

/**
 * Cancel subscription API
 * Updates user_profiles collection and subscriptions collection
 * Uses MongoDB native driver for better performance
 */
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

        // Connect to databases
        const { db } = await connectDB(); // MongoDB native driver for user_profiles
        await connectToDatabase(); // Mongoose for User model (backward compatibility)

        // Convert userId to ObjectId
        let userObjectId: ObjectId;
        try {
            userObjectId = new ObjectId(userId);
        } catch (error) {
            return NextResponse.json(
                { error: 'Invalid user ID format' },
                { status: 400 }
            );
        }

        // Get user from user_profiles collection (primary source)
        const userProfilesCollection = db.collection('user_profiles');
        const user = await userProfilesCollection.findOne({ _id: userObjectId });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Check if user has an active subscription in user_profiles
        const userSubscription = user.subscription as {
            status?: string;
            plan?: string;
            startDate?: Date;
            startMonth?: string;
            startTime?: string;
            endDate?: Date;
            paymentId?: string;
            orderId?: string;
            amount?: number;
        } | undefined;

        const hasActiveSubscription = userSubscription?.status === 'active' || user.isPremium || user.isMembership;

        if (!hasActiveSubscription) {
            return NextResponse.json(
                { 
                    error: 'No active subscription found',
                    hasActiveSubscription: false
                },
                { status: 400 }
            );
        }

        // Update user_profiles collection (primary source)
        const cancelDate = new Date();
        const updateResult = await userProfilesCollection.updateOne(
            { _id: userObjectId },
            {
                $set: {
                    isPremium: false,
                    isMembership: false,
                    'subscription.status': 'canceled',
                    'subscription.endDate': cancelDate
                }
            }
        );

        console.log('✅ user_profiles collection updated - subscription canceled:', {
            userId,
            matchedCount: updateResult.matchedCount,
            modifiedCount: updateResult.modifiedCount
        });

        // Update subscriptions collection
        const subscriptionsCollection = db.collection('subscriptions');
        const subscriptionUpdateResult = await subscriptionsCollection.updateOne(
            { 
                userId: userObjectId,
                status: 'active'
            },
            {
                $set: {
                    status: 'canceled',
                    canceledAt: cancelDate,
                    endDate: cancelDate,
                    updatedAt: cancelDate
                }
            }
        );

        console.log('✅ subscriptions collection updated:', {
            matchedCount: subscriptionUpdateResult.matchedCount,
            modifiedCount: subscriptionUpdateResult.modifiedCount
        });

        // Also update User model (Mongoose) for backward compatibility
        try {
            const User = mongoose.models.User || (await import('@/models/User')).default;
            await User.findByIdAndUpdate(
                userId,
                {
                    $set: {
                        isPremium: false,
                        'subscription.status': 'canceled',
                        'subscription.endDate': cancelDate
                    }
                }
            );
            console.log('✅ User model (Mongoose) updated for backward compatibility');
        } catch (mongooseError) {
            console.warn('⚠️ Could not update User model (Mongoose):', mongooseError);
            // Continue even if Mongoose update fails - user_profiles is primary
        }

        // Return success response
        return NextResponse.json({
            success: true,
            message: 'Subscription canceled successfully',
            subscription: {
                status: 'canceled',
                canceledAt: cancelDate,
                endDate: cancelDate
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
