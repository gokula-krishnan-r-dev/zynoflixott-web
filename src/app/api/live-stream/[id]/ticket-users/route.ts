import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Ticket from '@/models/Ticket';
import LiveStream from '@/models/LiveStream';

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

        // Only allow the creator of the live stream to see the list of users
        if (liveStream.userId !== userId && liveStream.createdBy !== userId) {
            return NextResponse.json({ error: 'You are not authorized to view this information' }, { status: 403 });
        }

        // Get query parameters for pagination
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const skip = (page - 1) * limit;

        // Get tickets for this event with pagination
        const tickets = await Ticket.find({ eventId })
            .sort({ purchaseDate: -1 })
            .skip(skip)
            .limit(limit);

        // Get total count for pagination
        const totalTickets = await Ticket.countDocuments({ eventId });
        const totalPages = Math.ceil(totalTickets / limit);

        // Group tickets by user and count
        const userTicketsMap = tickets.reduce((acc, ticket) => {
            const userId = ticket.userId;
            if (!acc[userId]) {
                acc[userId] = {
                    userId,
                    ticketCount: 0,
                    totalAmount: 0,
                    firstPurchase: ticket.purchaseDate,
                    lastPurchase: ticket.purchaseDate,
                    totalPurchases: 0
                };
            }

            // Add quantity instead of just incrementing by one
            const quantity = ticket.quantity || 1;
            acc[userId].ticketCount += quantity;
            acc[userId].totalAmount += ticket.amount;
            acc[userId].totalPurchases += 1;

            if (new Date(ticket.purchaseDate) < new Date(acc[userId].firstPurchase)) {
                acc[userId].firstPurchase = ticket.purchaseDate;
            }

            if (new Date(ticket.purchaseDate) > new Date(acc[userId].lastPurchase)) {
                acc[userId].lastPurchase = ticket.purchaseDate;
            }

            return acc;
        }, {} as Record<string, {
            userId: string;
            ticketCount: number;
            totalAmount: number;
            firstPurchase: Date;
            lastPurchase: Date;
            totalPurchases: number;
        }>);

        // Convert to array for response
        const userTickets = Object.values(userTicketsMap);

        // Calculate total tickets sold (counting quantity)
        const totalTicketsSold = tickets.reduce((sum, ticket) => sum + (ticket.quantity || 1), 0);

        return NextResponse.json({
            eventId,
            eventTitle: liveStream.movieTitle,
            totalTicketsSold: totalTicketsSold,
            totalUniqueUsers: userTickets.length,
            users: userTickets,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems: totalTickets,
                hasMore: page < totalPages
            }
        });
    } catch (error) {
        console.error('Error fetching ticket users:', error);
        return NextResponse.json({
            error: 'Failed to fetch ticket users',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 