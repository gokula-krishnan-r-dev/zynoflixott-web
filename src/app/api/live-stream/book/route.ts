import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { v4 as uuidv4 } from 'uuid';

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_live_N9cN73EC0erg5Y',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'TnaYiO5l4LOVv3Y1hu72kg84'
});

export async function POST(request: NextRequest) {
    try {
        // Verify request headers and permissions
        const userId = request.headers.get('userId');
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Parse request body
        const body = await request.json();
        const { eventId, ticketQuantity } = body;

        if (!eventId || !ticketQuantity || ticketQuantity < 1) {
            return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
        }

        // In a real application, fetch event details from database
        // For now, we'll use a mock fetch function
        const event = await fetchEventDetails(eventId);

        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        // Calculate price
        const baseAmount = event.ticketCost * ticketQuantity;
        const gstAmount = baseAmount * 0.18; // 18% GST
        const totalAmount = baseAmount + gstAmount;

        // Create an order in Razorpay
        const orderOptions = {
            amount: Math.round(totalAmount * 100), // amount in smallest currency unit (paisa)
            currency: 'INR',
            receipt: `ticket_${Math.random().toString(36).substr(2, 8)}`,
            notes: {
                userId: userId,
                eventId: eventId,
                ticketQuantity: ticketQuantity.toString(),
            }
        };

        const order = await razorpay.orders.create(orderOptions);
        
        // Return the order details for frontend to open Razorpay checkout
        return NextResponse.json({
            orderId: order.id,
            amount: totalAmount,
            currency: 'INR',
            eventDetails: {
                id: event.id,
                title: event.movieTitle,
                date: event.streamingDate,
                time: event.streamingTime
            }
        });
    } catch (error) {
        console.error('Error creating booking:', error);
        return NextResponse.json({
            error: 'Failed to process booking request',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }

}


///live-stream/book based on tickets and find by













// Mock function to fetch event details (in production, this would query a database)
async function fetchEventDetails(eventId: string) {
    // Simulate database fetch delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Return mock event data
    return {
        id: eventId,
        movieTitle: "Sample Movie",
        ticketCost: 199,
        streamingDate: "2023-12-31",
        streamingTime: "19:00"
    };
} 