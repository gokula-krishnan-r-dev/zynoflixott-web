import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import LiveStream from '@/models/LiveStream';
import Ticket from '@/models/Ticket';
import UserStreamActivity from '@/models/UserStreamActivity';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Verify user authentication
        const userId = request.headers.get('userId');
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const eventId = params.id;
        if (!eventId) {
            return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
        }

        // Connect to database
        await connectToDatabase();

        // Verify that the user is the creator of the live stream
        const liveStream = await LiveStream.findById(eventId);
        if (!liveStream) {
            return NextResponse.json({ error: 'Live stream not found' }, { status: 404 });
        }

        // Only allow the creator of the live stream to view analytics
        if (liveStream.userId !== userId && liveStream.createdBy !== userId) {
            return NextResponse.json({ error: 'You are not authorized to view this information' }, { status: 403 });
        }

        // Get all tickets for this event
        const tickets = await Ticket.find({ eventId });

        // Calculate total tickets sold (including quantity)
        const ticketsSold = tickets.reduce((sum, ticket) => sum + (ticket.quantity || 1), 0);

        // Calculate total revenue
        const revenue = tickets.reduce((sum, ticket) => sum + ticket.amount, 0);

        // Get the count of unique users who purchased tickets
        const uniqueTicketBuyers = await Ticket.distinct('userId', { eventId });

        // Get view analytics
        const viewActivities = await UserStreamActivity.find({
            eventId,
            activityType: 'view'
        });
        const totalViews = viewActivities.length;

        // Get unique viewers count
        const uniqueViewers = await UserStreamActivity.distinct('userId', {
            eventId,
            activityType: 'view'
        }).then(users => users.length);

        // Get total watch time
        const totalWatchTime = viewActivities.reduce((sum, activity) => sum + (activity.viewDuration || 0), 0);
        const avgWatchTimePerUser = uniqueViewers > 0 ? totalWatchTime / uniqueViewers : 0;

        // Get user activity breakdown by type
        const activityBreakdown = await UserStreamActivity.aggregate([
            { $match: { eventId } },
            { $group: { _id: '$activityType', count: { $sum: 1 } } }
        ]);

        // Format activity breakdown for response
        const formattedActivityBreakdown = activityBreakdown.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, {} as Record<string, number>);

        // Calculate ticket conversion rate (percentage of viewers who bought tickets)
        const ticketConversionRate = uniqueViewers > 0
            ? (uniqueTicketBuyers.length / uniqueViewers) * 100
            : 0;

        // Get recent activities
        const recentActivities = await UserStreamActivity.find({ eventId })
            .sort({ timestamp: -1 })
            .limit(10);

        // Calculate average tickets per purchase
        const avgTicketsPerPurchase = tickets.length > 0
            ? ticketsSold / tickets.length
            : 0;

        return NextResponse.json({
            eventId,
            eventTitle: liveStream.movieTitle,
            analytics: {
                tickets: {
                    ticketsSold,
                    revenue,
                    uniqueBuyers: uniqueTicketBuyers.length,
                    totalPurchases: tickets.length,
                    avgTicketsPerPurchase: Math.round(avgTicketsPerPurchase * 100) / 100
                },
                views: {
                    totalViews,
                    uniqueViewers,
                    totalWatchTime,
                    avgWatchTimePerUser: Math.round(avgWatchTimePerUser * 100) / 100
                },
                engagement: {
                    activityBreakdown: formattedActivityBreakdown,
                    ticketConversionRate: Math.round(ticketConversionRate * 100) / 100
                }
            },
            recentActivities
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        return NextResponse.json({
            error: 'Failed to fetch analytics',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 