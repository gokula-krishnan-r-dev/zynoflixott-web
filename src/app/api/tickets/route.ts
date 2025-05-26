import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Ticket from '@/models/Ticket';
import LiveStream from '@/models/LiveStream';

export async function GET(request: NextRequest) {
    try {
        // Verify user authentication
        const userId = request.headers.get('userId');
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Connect to database
        await connectToDatabase();

        // Get query parameters
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        // Fetch tickets for this user
        const tickets = await Ticket.find({ userId })
            .sort({ purchaseDate: -1 })
            .skip(skip)
            .limit(limit);

        // Get total count for pagination
        const totalTickets = await Ticket.countDocuments({ userId });
        const totalPages = Math.ceil(totalTickets / limit);

        // Fetch live stream details for these tickets
        const eventIds = tickets.map(ticket => ticket.eventId);
        const liveStreams = await LiveStream.find({ _id: { $in: eventIds } });

        // Combine ticket and live stream data
        const ticketData = tickets.map(ticket => {
            const stream = liveStreams.find(ls => ls._id.toString() === ticket.eventId.toString());
            return {
                ticket: {
                    _id: ticket._id,
                    orderId: ticket.orderId,
                    paymentId: ticket.paymentId,
                    purchaseDate: ticket.purchaseDate,
                    status: ticket.status,
                    amount: ticket.amount
                },
                stream: stream ? {
                    _id: stream._id,
                    movieTitle: stream.movieTitle,
                    movieSubtitles: stream.movieSubtitles,
                    streamingDate: stream.streamingDate,
                    moviePoster: stream.moviePoster,
                    streamingTime: stream.streamingTime,
                    status: stream.status,
                    movieCategory: stream.movieCategory,
                    movieLanguage: stream.movieLanguage
                } : null
            };
        });

        return NextResponse.json({
            tickets: ticketData,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems: totalTickets,
                hasMore: page < totalPages
            }
        });
    } catch (error) {
        console.error('Error fetching tickets:', error);
        return NextResponse.json({
            error: 'Failed to fetch tickets',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 