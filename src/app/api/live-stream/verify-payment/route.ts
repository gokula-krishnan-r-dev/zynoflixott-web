import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectToDatabase from '@/lib/mongodb';
import Ticket from '@/models/Ticket';
import LiveStream from '@/models/LiveStream';
import UserStreamActivity from '@/models/UserStreamActivity';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
    try {
        // Verify request headers and permissions
        const userId = request.headers.get('userId');
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Parse request body
        const body = await request.json();
        const {
            orderId,
            paymentId,
            signature,
            eventId,
            ticketQuantity,
            amount
        } = body;

        if (!orderId || !paymentId || !signature || !eventId || !ticketQuantity) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Verify payment signature
        const isValidPayment = verifyPaymentSignature(orderId, paymentId, signature);
        if (!isValidPayment) {
            return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
        }

        // Connect to database
        await connectToDatabase();

        // Get the live stream details
        const liveStream = await LiveStream.findById(eventId);
        if (!liveStream) {
            return NextResponse.json({ error: 'Live stream not found' }, { status: 404 });
        }

        // Create ticket in database
        const ticketData = {
            userId,
            eventId: new mongoose.Types.ObjectId(eventId),
            orderId,
            paymentId,
            amount: amount || (liveStream.ticketCost * ticketQuantity),
            quantity: ticketQuantity,
            status: 'active',
            purchaseDate: new Date()
        };

        const ticket = await Ticket.create(ticketData);

        // Update LiveStream ticketsSold count
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
            message: 'Payment verified and tickets registered successfully',
            ticket: ticket
        });
    } catch (error) {
        console.error('Error verifying payment:', error);
        return NextResponse.json({
            error: 'Failed to verify payment',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// Verify the payment signature from Razorpay
function verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean {
    try {
        const razorpaySecret = process.env.RAZORPAY_KEY_SECRET || 'your_razorpay_secret';
        const hmac = crypto.createHmac('sha256', razorpaySecret);
        hmac.update(orderId + '|' + paymentId);
        const generatedSignature = hmac.digest('hex');

        return generatedSignature === signature;
    } catch (error) {
        console.error('Error verifying signature:', error);
        return false;
    }
}

// Mock function to register tickets (in production, this would save to a database)
async function registerTickets(
    userId: string,
    eventId: string,
    orderId: string,
    paymentId: string,
    quantity: number
) {
    // Simulate database operation delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Generate mock ticket IDs
    const ticketIds = Array.from({ length: quantity }, (_, i) => ({
        id: `ticket_${Date.now()}_${i}`,
        eventId,
        userId,
        orderId,
        paymentId
    }));

    // In a real app, you would save these tickets to your database
    // and update the event's ticketsSold count

    return ticketIds;
} 