import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import connectToDatabase from '@/lib/mongodb';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Initialize Razorpay with credentials
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const { amount, videoId, creatorId, currency = 'USD', paymentType = 'gift' } = await request.json();

        // Validate required fields
        if (!amount || !videoId || !creatorId) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Create a unique receipt ID
        const timestamp = Date.now().toString();
        const receiptId = `gift_${timestamp}`;

        // Create order in Razorpay
        const order = await razorpay.orders.create({
            amount: amount, // Amount in smallest currency unit (cents/paise)
            currency: currency,
            receipt: receiptId,
            notes: {
                videoId,
                creatorId,
                paymentType
            },
        });

        // Connect to database
        await connectToDatabase();

        // Store order details in database
        await mongoose.connection.collection('paymentOrders').insertOne({
            orderId: order.id,
            receiptId,
            amount: amount,
            currency: currency,
            videoId: videoId,
            creatorId: creatorId,
            paymentType: paymentType,
            status: 'created',
            createdAt: new Date()
        });

        // Return order details to client
        return NextResponse.json({
            success: true,
            order: {
                id: order.id,
                amount: order.amount,
                currency: order.currency,
            },
        });
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json(
            { error: 'Failed to create payment order' },
            { status: 500 }
        );
    }
} 