import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Ticket from '@/models/Ticket';
import LiveStream from '@/models/LiveStream';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
    try {
        // Verify user authentication
        const userId = request.headers.get('userId');
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Connect to database
        await connectToDatabase();

        // Get query parameters for pagination
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;
        const status = searchParams.get('status') || 'active'; // Filter by ticket status

        // Build the query
        const query: any = { userId };
        if (status !== 'all') {
            query.status = status;
        }

        // Get tickets for this user with pagination
        const tickets = await Ticket.find(query)
            .sort({ purchaseDate: -1 })
            .skip(skip)
            .limit(limit);

        // Get total count for pagination
        const totalTickets = await Ticket.countDocuments(query);
        const totalPages = Math.ceil(totalTickets / limit);

        // Get live stream details for these tickets
        const eventIds = tickets.map(ticket => ticket.eventId);
        const liveStreams = await LiveStream.find({
            _id: { $in: eventIds }
        });

        // Group tickets by event
        const eventTickets: Record<string, {
            event: any,
            totalTickets: number,
            purchases: any[],
            totalAmount: number
        }> = {};

        tickets.forEach(ticket => {
            const eventId = ticket.eventId.toString();
            const event = liveStreams.find(stream => stream._id.toString() === eventId);

            if (!eventTickets[eventId]) {
                eventTickets[eventId] = {
                    event: event ? {
                        _id: event._id,
                        movieTitle: event.movieTitle,
                        movieSubtitles: event.movieSubtitles,
                        movieCategory: event.movieCategory,
                        movieLanguage: event.movieLanguage,
                        streamingDate: event.streamingDate,
                        streamingTime: event.streamingTime,
                        posterImage: event.posterImage,
                        movieTrailer: event.movieTrailer,
                        movieLength: event.movieLength,
                        movieCertificate: event.movieCertificate,
                        movieDescription: event.movieDescription,
                        movieDirector: event.movieDirector,
                        movieProducer: event.movieProducer,
                        movieHero: event.movieHero,
                        movieHeroine: event.movieHeroine,
                        movieGenre: event.movieGenre,
                        movieRating: event.movieRating,
                        movieCast: event.movieCast,
                        status: event.status
                    } : { _id: eventId, movieTitle: 'Unknown Event', status: 'unknown' },
                    totalTickets: 0,
                    purchases: [],
                    totalAmount: 0
                };
            }

            // Add this purchase to the event
            eventTickets[eventId].purchases.push({
                ticketId: ticket._id,
                orderId: ticket.orderId,
                paymentId: ticket.paymentId,
                purchaseDate: ticket.purchaseDate,
                quantity: ticket.quantity || 1,
                amount: ticket.amount,
                status: ticket.status
            });

            // Update totals
            eventTickets[eventId].totalTickets += (ticket.quantity || 1);
            eventTickets[eventId].totalAmount += ticket.amount;
        });

        // Convert to array for response
        const formattedEvents = Object.values(eventTickets);

        // Sort events by date (most recent streaming date first)
        formattedEvents.sort((a, b) => {
            const dateA = a.event.streamingDate ? new Date(a.event.streamingDate) : new Date(0);
            const dateB = b.event.streamingDate ? new Date(b.event.streamingDate) : new Date(0);
            return dateB.getTime() - dateA.getTime();
        });

        // Calculate summary statistics
        const totalTicketCount = formattedEvents.reduce((sum, event) => sum + event.totalTickets, 0);
        const totalSpent = formattedEvents.reduce((sum, event) => sum + event.totalAmount, 0);

        return NextResponse.json({
            tickets: formattedEvents,
            summary: {
                totalEvents: formattedEvents.length,
                totalTickets: totalTicketCount,
                totalSpent
            },
            pagination: {
                currentPage: page,
                totalPages,
                totalItems: totalTickets,
                hasMore: page < totalPages
            }
        });
    } catch (error) {
        console.error('Error fetching user tickets:', error);
        return NextResponse.json({
            error: 'Failed to fetch user tickets',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 