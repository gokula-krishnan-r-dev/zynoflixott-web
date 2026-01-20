import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongo';
import { ObjectId } from 'mongodb';
import { isSubscriptionActive } from '@/lib/subscription';

/**
 * Optimized subscription check API
 * Checks user_profiles collection subscription field with startMonth, startTime, startDate
 * This API is called every time before video playback
 * Uses MongoDB native driver for better performance
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

        // Connect to database using MongoDB native driver
        const { db } = await connectDB();
        const userProfilesCollection = db.collection('user_profiles');
        const subscriptionsCollection = db.collection('subscriptions');

        // Convert userId to ObjectId
        let userObjectId: ObjectId;
        try {
            userObjectId = new ObjectId(userId);
        } catch (error) {
            return NextResponse.json(
                { 
                    hasSubscription: false,
                    isPremium: false,
                    message: 'Invalid user ID format'
                },
                { status: 400 }
            );
        }

        // Get user from user_profiles collection (primary source)
        const user = await userProfilesCollection.findOne({ _id: userObjectId });

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

        // Check subscription in user_profiles collection (primary check)
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

        const hasActiveSubscription = isSubscriptionActive(userSubscription) || (user.isPremium ?? false) || (user.isMembership ?? false);

        // Get subscription details from user_profiles
        const subscriptionDetails = userSubscription ? {
            status: userSubscription.status,
            plan: userSubscription.plan,
            startDate: userSubscription.startDate,
            startMonth: userSubscription.startMonth,
            startTime: userSubscription.startTime,
            endDate: userSubscription.endDate,
            paymentId: userSubscription.paymentId,
            orderId: userSubscription.orderId,
            amount: userSubscription.amount
        } : null;

        // Also check subscriptions collection as backup/verification
        let dbSubscriptionActive = false;
        let dbSubscriptionDetails = null;
        try {
            const activeSubscription = await subscriptionsCollection.findOne({
                userId: userObjectId,
                status: 'active',
                endDate: { $gt: new Date() }
            }, {
                sort: { createdAt: -1 }
            });

            if (activeSubscription) {
                dbSubscriptionActive = true;
                // Extract month and time from startDate if available
                const subStartDate = activeSubscription.startDate ? new Date(activeSubscription.startDate) : new Date();
                const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
                const subStartMonth = monthNames[subStartDate.getMonth()];
                const subStartTime = `${String(subStartDate.getHours()).padStart(2, '0')}:${String(subStartDate.getMinutes()).padStart(2, '0')}:${String(subStartDate.getSeconds()).padStart(2, '0')}`;
                
                dbSubscriptionDetails = {
                    status: activeSubscription.status,
                    plan: 'premium',
                    startDate: activeSubscription.startDate,
                    startMonth: subStartMonth,
                    startTime: subStartTime,
                    endDate: activeSubscription.endDate,
                    paymentId: activeSubscription.paymentId,
                    orderId: activeSubscription.orderId,
                    amount: activeSubscription.amount
                };
            }
        } catch (dbError) {
            console.error('Error checking subscriptions collection:', dbError);
            // Continue with user_profiles check
        }

        // Final subscription status (user_profiles takes priority, subscriptions collection as backup)
        const finalHasSubscription = hasActiveSubscription || dbSubscriptionActive;
        
        // Use user_profiles subscription if available, otherwise use subscriptions collection data
        const finalSubscriptionDetails = subscriptionDetails || dbSubscriptionDetails;

        return NextResponse.json({
            success: true,
            hasSubscription: finalHasSubscription,
            isPremium: finalHasSubscription,
            subscription: finalSubscriptionDetails,
            subscriptionStatus: {
                isActive: finalHasSubscription,
                status: finalSubscriptionDetails?.status || 'inactive',
                plan: finalSubscriptionDetails?.plan || null,
                startDate: finalSubscriptionDetails?.startDate || null,
                startMonth: finalSubscriptionDetails?.startMonth || null,
                startTime: finalSubscriptionDetails?.startTime || null,
                endDate: finalSubscriptionDetails?.endDate || null,
                source: subscriptionDetails ? 'user_profiles' : (dbSubscriptionDetails ? 'subscriptions_collection' : 'none')
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
