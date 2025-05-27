import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import connectToDatabase from '@/lib/mongodb';
import mongoose from 'mongoose';

// Initialize Razorpay with credentials
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const {
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
            amount,
            videoId,
            creatorId
        } = await request.json();

        // Validate required fields
        if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
            return NextResponse.json(
                { error: 'Missing payment verification details' },
                { status: 400 }
            );
        }

        // Connect to database
        await connectToDatabase();

        // Verify payment signature
        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
            .update(`${razorpayOrderId}|${razorpayPaymentId}`)
            .digest('hex');

        // Compare signatures
        const isSignatureValid = generatedSignature === razorpaySignature;

        if (!isSignatureValid) {
            // Update payment status to failed
            await mongoose.connection.collection('paymentOrders').updateOne(
                { orderId: razorpayOrderId },
                {
                    $set: {
                        status: 'failed',
                        paymentId: razorpayPaymentId,
                        updatedAt: new Date(),
                        error: 'Invalid signature'
                    }
                }
            );

            return NextResponse.json(
                { success: false, error: 'Invalid payment signature' },
                { status: 400 }
            );
        }

        // Update payment status to successful
        await mongoose.connection.collection('paymentOrders').updateOne(
            { orderId: razorpayOrderId },
            {
                $set: {
                    status: 'success',
                    paymentId: razorpayPaymentId,
                    signature: razorpaySignature,
                    updatedAt: new Date()
                }
            }
        );

        // Record the gift in database
        await mongoose.connection.collection('videoGifts').insertOne({
            videoId,
            creatorId,
            userId: request.headers.get('userId') || 'anonymous', // Get user ID from request if available
            amount,
            paymentId: razorpayPaymentId,
            orderId: razorpayOrderId,
            createdAt: new Date()
        });

        // Update creator's earnings
        await mongoose.connection.collection('creatorEarnings').updateOne(
            { creatorId },
            {
                $inc: {
                    totalEarnings: amount,
                    giftEarnings: amount
                },
                $set: {
                    updatedAt: new Date()
                }
            },
            { upsert: true }
        );

        // Return success response
        return NextResponse.json({
            success: true,
            message: 'Payment verified successfully',
            data: {
                paymentId: razorpayPaymentId,
                orderId: razorpayOrderId
            }
        });
    } catch (error) {
        console.error('Error verifying payment:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to verify payment' },
            { status: 500 }
        );
    }
} 