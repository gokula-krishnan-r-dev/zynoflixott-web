import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import connectToDatabase from '@/lib/mongodb';
import mongoose from 'mongoose';

// Get Razorpay credentials from environment
const razorpayKeyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_S6AcB6I8TQuoVM';
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || '';

// Validate that key_secret is provided
if (!razorpayKeySecret) {
    console.error('⚠️ RAZORPAY_KEY_SECRET is missing! Please set it in your .env.local file.');
    console.error('For test mode, get your test key_secret from: https://dashboard.razorpay.com/app/keys');
}

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: razorpayKeyId,
    key_secret: razorpayKeySecret
});

export async function POST(request: NextRequest) {
    try {
        // Validate Razorpay credentials before processing
        if (!razorpayKeySecret) {
            return NextResponse.json(
                { 
                    error: 'Razorpay configuration error',
                    message: 'RAZORPAY_KEY_SECRET is not set. Please add it to your .env.local file.',
                    help: 'Get your test key_secret from: https://dashboard.razorpay.com/app/keys'
                },
                { status: 500 }
            );
        }

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

        // Create a unique receipt ID (max 40 chars for Razorpay)
        // Format: sub_<8char_userId>_<8char_timestamp> = max 25 chars
        const timestamp = Date.now();
        const shortUserId = userId.length > 8 ? userId.slice(-8) : userId.padStart(8, '0');
        const shortTimestamp = timestamp.toString().slice(-8);
        let receiptId = `sub_${shortUserId}_${shortTimestamp}`;
        
        // Ensure it's exactly 40 chars or less
        if (receiptId.length > 40) {
            receiptId = receiptId.slice(0, 40);
        }

        // Create order in Razorpay
        const orderOptions = {
            amount: Math.round(amount * 100), // Convert to paise
            currency: currency,
            receipt: receiptId,
            notes: {
                userId: userId,
                type: 'subscription',
                plan: 'premium'
            },
            payment_capture: 1 // Auto capture payment (use 1 instead of true for Razorpay)
        };

        console.log('Creating Razorpay order with options:', {
            amount: orderOptions.amount,
            currency: orderOptions.currency,
            receipt: orderOptions.receipt,
            userId: userId
        });

        let order;
        try {
            order = await razorpay.orders.create(orderOptions);
        } catch (razorpayError: any) {
            console.error('Razorpay order creation error:', razorpayError);
            
            // Handle specific Razorpay errors
            if (razorpayError.statusCode === 401) {
                return NextResponse.json(
                    { 
                        error: 'Razorpay authentication failed. Please check your API keys.',
                        details: 'Make sure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are correct and match (test with test, live with live)'
                    },
                    { status: 401 }
                );
            }
            
            throw razorpayError;
        }

        // Validate order was created
        if (!order || !order.id) {
            console.error('Razorpay order creation failed - no order ID returned');
            return NextResponse.json(
                { 
                    error: 'Failed to create order in Razorpay',
                    details: 'Order ID is missing from Razorpay response'
                },
                { status: 500 }
            );
        }

        console.log('Razorpay order created successfully:', order.id);

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

        // Validate order was created successfully
        if (!order || !order.id) {
            return NextResponse.json(
                { 
                    error: 'Failed to create order - invalid response from Razorpay',
                    details: 'Order ID is missing'
                },
                { status: 500 }
            );
        }

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
        
        // Provide more specific error messages
        let errorMessage = 'Failed to create subscription order';
        let statusCode = 500;
        
        if (error.statusCode === 401) {
            errorMessage = 'Razorpay authentication failed. Please check your API keys. Make sure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET match (test keys with test keys, live keys with live keys).';
            statusCode = 401;
        } else if (error.statusCode === 400) {
            errorMessage = error.error?.description || error.message || 'Invalid request to Razorpay';
            statusCode = 400;
        }
        
        return NextResponse.json(
            { 
                error: errorMessage,
                details: error.error?.description || error.message,
                statusCode: error.statusCode
            },
            { status: statusCode }
        );
    }
}
