import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import connectToDatabase from '@/lib/mongodb';
import mongoose from 'mongoose';

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_live_N9cN73EC0erg5Y',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'TnaYiO5l4LOVv3Y1hu72kg84'
});

export async function POST(request: NextRequest) {
    try {
        // Verify user authentication
        const userId = request.headers.get('userId');
        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized. Please login to subscribe.' },
                { status: 401 }
            );
        }

        // Parse request body
        const body = await request.json();
        const { amount, currency = 'INR' } = body;

        // Validate amount
        if (!amount || amount < 1) {
            return NextResponse.json(
                { error: 'Invalid subscription amount' },
                { status: 400 }
            );
        }

        // Connect to database
        await connectToDatabase();

        // Check if user already has an active subscription
        const User = mongoose.models.User || (await import('@/models/User')).default;
        const user = await User.findById(userId);

        if (user?.subscription?.status === 'active') {
            const endDate = user.subscription.endDate;
            if (endDate && new Date(endDate) > new Date()) {
                return NextResponse.json(
                    { 
                        error: 'You already have an active subscription',
                        subscription: {
                            status: user.subscription.status,
                            endDate: user.subscription.endDate
                        }
                    },
                    { status: 400 }
                );
            }
        }

        // Create a unique receipt ID
        const timestamp = Date.now();
        const receiptId = `sub_${userId}_${timestamp}`;

        // Create order in Razorpay
        const order = await razorpay.orders.create({
            amount: Math.round(amount * 100), // Convert to paise
            currency: currency,
            receipt: receiptId,
            notes: {
                userId: userId,
                type: 'subscription',
                plan: 'premium'
            },
            payment_capture: 1 // Auto capture payment
        });

        // Store order details in database
        await mongoose.connection.collection('subscriptionOrders').insertOne({
            orderId: order.id,
            receiptId,
            userId: new mongoose.Types.ObjectId(userId),
            amount: amount,
            currency: currency,
            status: 'created',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // Return order details
        return NextResponse.json({
            success: true,
            order: {
                id: order.id,
                amount: order.amount,
                currency: order.currency,
                receipt: order.receipt
            }
        });
    } catch (error: any) {
        console.error('Error creating subscription order:', error);
        return NextResponse.json(
            { 
                error: 'Failed to create subscription order',
                details: error.message
            },
            { status: 500 }
        );
    }
}
