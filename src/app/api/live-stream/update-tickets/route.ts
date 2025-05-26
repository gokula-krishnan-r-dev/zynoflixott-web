import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import LiveStream from '@/models/LiveStream';
import Ticket from '@/models/Ticket';
import UserStreamActivity from '@/models/UserStreamActivity';
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
        const { eventId, ticketQuantity, orderId, paymentId } = body;

        if (!eventId || !ticketQuantity) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Connect to database
        await connectToDatabase();

        // Get the live stream details to get the ticket cost
        const liveStream = await LiveStream.findById(eventId);
        if (!liveStream) {
            return NextResponse.json({ error: 'Live stream not found' }, { status: 404 });
        }

        // Calculate the amount
        const amount = liveStream.ticketCost * ticketQuantity;

        // Create a new ticket record
        const ticketData = {
            userId,
            eventId: new mongoose.Types.ObjectId(eventId),
            orderId: orderId || `order_${Date.now()}`,
            paymentId: paymentId || `pay_${Date.now()}`,
            amount,
            quantity: ticketQuantity,
            status: 'active',
            purchaseDate: new Date()
        };

        const ticket = await Ticket.create(ticketData);

        // Update the live stream's ticketsSold count
        const updatedLiveStream = await LiveStream.findByIdAndUpdate(
            eventId,
            { $inc: { ticketsSold: ticketQuantity } },
            { new: true }
        );

        // Record activity in UserStreamActivity collection
        await UserStreamActivity.create({
            userId,
            eventId: new mongoose.Types.ObjectId(eventId),
            activityType: 'purchase',
            ticketId: ticket._id,
            orderId: ticket.orderId,
            paymentId: ticket.paymentId,
            amount: ticket.amount,
            timestamp: new Date(),
            interactionData: {
                ticketQuantity,
                movieTitle: liveStream.movieTitle,
                streamingDate: liveStream.streamingDate,
                streamingTime: liveStream.streamingTime
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Ticket purchased successfully',
            ticket,
            ticketsSold: updatedLiveStream?.ticketsSold || 0
        });
    } catch (error) {
        console.error('Error updating tickets:', error);
        return NextResponse.json({
            error: 'Failed to update tickets',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 