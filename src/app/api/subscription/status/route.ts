import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import mongoose from 'mongoose';
import { isSubscriptionActive } from '@/lib/subscription';
import type { IUser } from '@/models/User';

/**
 * Comprehensive subscription status check API
 * Checks both User model and subscriptions collection for accurate status
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

        // Check subscription in User model
        const userSubscriptionActive = isSubscriptionActive(user?.subscription);
        const userIsPremium = user?.isPremium || false;

        // Check subscription in subscriptions collection (more reliable)
        let dbSubscription = null;
        let dbSubscriptionActive = false;

        try {
            const subscriptionsCollection = mongoose.connection.collection('subscriptions');
            const activeSubscription = await subscriptionsCollection.findOne({
                userId: new mongoose.Types.ObjectId(userId),
                status: 'active',
                endDate: { $gt: new Date() } // Not expired
            }, {
                sort: { createdAt: -1 } // Get most recent
            });

            if (activeSubscription) {
                dbSubscription = {
                    status: activeSubscription.status,
                    plan: 'premium',
                    startDate: activeSubscription.startDate,
                    endDate: activeSubscription.endDate,
                    orderId: activeSubscription.orderId,
                    paymentId: activeSubscription.paymentId,
                    amount: activeSubscription.amount
                };
                dbSubscriptionActive = true;
            }
        } catch (dbError) {
            console.error('Error checking subscriptions collection:', dbError);
            // Continue with User model check if collection query fails
        }

        // Determine final subscription status
        // Priority: DB subscription > User model subscription > isPremium flag
        const hasActiveSubscription = dbSubscriptionActive || userSubscriptionActive || userIsPremium;
        
        // Use DB subscription if available, otherwise use User model subscription
        const finalSubscription = dbSubscription || user?.subscription || null;

        // Update User model if DB has active subscription but User model doesn't
        if (dbSubscriptionActive && dbSubscription && (!userSubscriptionActive || !userIsPremium)) {
            try {
                await User.findByIdAndUpdate(
                    userId,
                    {
                        $set: {
                            isPremium: true,
                            subscription: {
                                status: 'active',
                                plan: 'premium',
                                startDate: dbSubscription.startDate,
                                endDate: dbSubscription.endDate
                            }
                        }
                    },
                    { new: true }
                );
                console.log('✅ Updated User model with subscription from DB');
            } catch (updateError) {
                console.error('Error updating User model:', updateError);
                // Continue even if update fails
            }
        }

        return NextResponse.json({
            success: true,
            hasSubscription: hasActiveSubscription,
            isPremium: hasActiveSubscription,
            subscription: finalSubscription,
            subscriptionStatus: {
                isActive: hasActiveSubscription,
                status: finalSubscription?.status || 'inactive',
                plan: finalSubscription?.plan || null,
                startDate: finalSubscription?.startDate || null,
                endDate: finalSubscription?.endDate || null,
                source: dbSubscriptionActive ? 'database' : (userSubscriptionActive ? 'user_model' : 'none')
            },
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error('Error checking subscription status:', error);
        return NextResponse.json(
            { 
                success: false,
                hasSubscription: false,
                isPremium: false,
                error: 'Failed to check subscription status',
                details: error.message
            },
            { status: 500 }
        );
    }
}
