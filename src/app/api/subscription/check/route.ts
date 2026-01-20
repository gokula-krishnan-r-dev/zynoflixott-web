import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import mongoose from 'mongoose';
import { isSubscriptionActive } from '@/lib/subscription';
import type { IUser } from '@/models/User';

/**
 * Optimized subscription check API
 * Checks User model subscription field with startMonth, startTime, startDate
 * This API is called every time before video playback
 */
export async function GET(request: NextRequest) {
    try {
        // Verify user authentication
        const userId = request.headers.get('userId');
        if (!userId) {
            return NextResponse.json(
                { 
                    hasSubscription: false,
                    isPremium: false,
                    message: 'User not authenticated'
                },
                { status: 401 }
            );
        }

        // Connect to database
        await connectToDatabase();

        // Get user from User model
        const User = (await import('@/models/User')).default;
        const user = await User.findById(userId).lean() as IUser | null;

        if (!user) {
            return NextResponse.json(
                { 
                    hasSubscription: false,
                    isPremium: false,
                    message: 'User not found'
                },
                { status: 404 }
            );
        }

        // Check subscription in User model (primary check)
        const hasActiveSubscription = isSubscriptionActive(user.subscription) || (user.isPremium ?? false);

        // Get subscription details
        const subscriptionDetails = user.subscription ? {
            status: user.subscription.status,
            plan: user.subscription.plan,
            startDate: user.subscription.startDate,
            startMonth: user.subscription.startMonth,
            startTime: user.subscription.startTime,
            endDate: user.subscription.endDate,
            paymentId: user.subscription.paymentId,
            orderId: user.subscription.orderId,
            amount: user.subscription.amount
        } : null;

        // Also check subscriptions collection as backup
        let dbSubscriptionActive = false;
        try {
            const subscriptionsCollection = mongoose.connection.collection('subscriptions');
            const activeSubscription = await subscriptionsCollection.findOne({
                userId: new mongoose.Types.ObjectId(userId),
                status: 'active',
                endDate: { $gt: new Date() }
            }, {
                sort: { createdAt: -1 }
            });

            if (activeSubscription) {
                dbSubscriptionActive = true;
            }
        } catch (dbError) {
            console.error('Error checking subscriptions collection:', dbError);
            // Continue with User model check
        }

        // Final subscription status (User model takes priority)
        const finalHasSubscription = hasActiveSubscription || dbSubscriptionActive;

        return NextResponse.json({
            success: true,
            hasSubscription: finalHasSubscription,
            isPremium: finalHasSubscription,
            subscription: subscriptionDetails,
            subscriptionStatus: {
                isActive: finalHasSubscription,
                status: subscriptionDetails?.status || 'inactive',
                plan: subscriptionDetails?.plan || null,
                startDate: subscriptionDetails?.startDate || null,
                startMonth: subscriptionDetails?.startMonth || null,
                startTime: subscriptionDetails?.startTime || null,
                endDate: subscriptionDetails?.endDate || null,
                source: 'user_model'
            },
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error('Error checking subscription:', error);
        return NextResponse.json(
            { 
                success: false,
                hasSubscription: false,
                isPremium: false,
                error: 'Failed to check subscription',
                details: error.message
            },
            { status: 500 }
        );
    }
}
