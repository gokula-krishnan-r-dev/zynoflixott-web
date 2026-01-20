import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { isSubscriptionActive } from '@/lib/subscription';

export async function GET(request: NextRequest) {
    try {
        // Verify user authentication
        const userId = request.headers.get('userId');
        if (!userId) {
            return NextResponse.json(
                { 
                    hasSubscription: false,
                    message: 'User not authenticated'
                },
                { status: 401 }
            );
        }

        // Connect to database
        await connectToDatabase();

        // Get user subscription status
        const User = (await import('@/models/User')).default;
        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json(
                { 
                    hasSubscription: false,
                    message: 'User not found'
                },
                { status: 404 }
            );
        }

        // Check subscription status
        const hasActiveSubscription = isSubscriptionActive(user.subscription) || user.isPremium;

        return NextResponse.json({
            hasSubscription: hasActiveSubscription,
            subscription: user.subscription || null,
            isPremium: user.isPremium || false
        });
    } catch (error: any) {
        console.error('Error checking subscription status:', error);
        return NextResponse.json(
            { 
                hasSubscription: false,
                error: 'Failed to check subscription status',
                details: error.message
            },
            { status: 500 }
        );
    }
}
