import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Ticket from '@/models/Ticket';
import LiveStream from '@/models/LiveStream';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
    try {
        // Verify user authentication
        const userId = request.headers.get('userId');
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Parse request body
        const body = await request.json();
        const { eventId } = body;

        if (!eventId) {
            return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
        }

        // Connect to database
        await connectToDatabase();

        // Check if the live stream exists
        const liveStream = await LiveStream.findById(eventId);
        if (!liveStream) {
            return NextResponse.json({ error: 'Live stream not found' }, { status: 404 });
        }

        // Check if the user has an active ticket for this event
        const tickets = await Ticket.find({
            userId,
            eventId,
            status: 'active'
        });

        const hasValidTicket = tickets.length > 0;
        const totalTickets = tickets.reduce((sum, ticket) => sum + (ticket.quantity || 1), 0);

        if (!hasValidTicket) {
            return NextResponse.json({
                hasValidTicket: false,
                message: 'No valid ticket found for this event'
            });
        }

        return NextResponse.json({
            hasValidTicket: true,
            totalTickets,
            tickets: tickets.map(ticket => ({
                ticketId: ticket._id,
                orderId: ticket.orderId,
                purchaseDate: ticket.purchaseDate,
                quantity: ticket.quantity || 1,
                status: ticket.status
            })),
            event: {
                _id: liveStream._id,
                movieTitle: liveStream.movieTitle,
                streamingDate: liveStream.streamingDate,
                streamingTime: liveStream.streamingTime,
                status: liveStream.status
            }
        });
    } catch (error) {
        console.error('Error checking ticket:', error);
        return NextResponse.json({
            error: 'Failed to check ticket',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 