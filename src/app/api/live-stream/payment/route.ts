import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Razorpay from "razorpay";
import { v4 as uuidv4 } from "uuid";
import LiveStream from "@/models/LiveStream";

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "rzp_live_2wtNMTtIzCco0O",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "rzp_test_key_secret",
});

// MongoDB connection
const connectMongoDB = async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            return mongoose.connection;
        }
        const uri = process.env.MONGODB_URI || "mongodb+srv://admin:zyn0f1ix@cluster0.fjf3fcj.mongodb.net/zynoflix";
        await mongoose.connect(uri);
        return mongoose.connection;
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
};

export async function POST(request: NextRequest) {
    try {
        await connectMongoDB();

        // Verify request headers and permissions
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

        // Fetch event details
        const event = await LiveStream.findById(eventId);
        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        // Check if the event date is in the past
        const eventDateTime = new Date(`${event.streamingDate}T${event.streamingTime}`);
        if (eventDateTime < new Date()) {
            return NextResponse.json({ error: 'This event has already started or ended' }, { status: 400 });
        }

        // Calculate price
        const baseAmount = event.ticketCost;
        const gstAmount = baseAmount * 0.18; // 18% GST
        const totalAmount = baseAmount + gstAmount;

        // Create an order in Razorpay
        const orderOptions = {
            amount: Math.round(totalAmount * 100), // amount in smallest currency unit (paisa)
            currency: 'INR',
            receipt: `ticket_${uuidv4().substring(0, 8)}`,
            notes: {
                userId: userId,
                eventId: eventId
            }
        };

        const order = await razorpay.orders.create(orderOptions);

        // Return the order details for frontend to open Razorpay checkout
        return NextResponse.json({
            orderId: order.id,
            amount: totalAmount,
            currency: 'INR',
            eventDetails: {
                id: event._id,
                title: event.movieTitle,
                date: event.streamingDate,
                time: event.streamingTime
            }
        });
    } catch (error) {
        console.error('Error creating payment order:', error);
        return NextResponse.json({
            error: 'Failed to process payment request',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 