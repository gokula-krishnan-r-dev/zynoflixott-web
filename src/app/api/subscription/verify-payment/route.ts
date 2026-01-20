import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import connectToDatabase from '@/lib/mongodb';
import mongoose from 'mongoose';

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_HJG5Rtuy8Xh2NB',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'TnaYiO5l4LOVv3Y1hu72kg84'
});

export async function POST(request: NextRequest) {
    try {
        // Verify user authentication
        const userId = request.headers.get('userId');
        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Parse request body
        const {
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
            amount
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
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'TnaYiO5l4LOVv3Y1hu72kg84')
            .update(`${razorpayOrderId}|${razorpayPaymentId}`)
            .digest('hex');

        // Compare signatures
        const isSignatureValid = generatedSignature === razorpaySignature;

        if (!isSignatureValid) {
            // Update payment status to failed
            await mongoose.connection.collection('subscriptionOrders').updateOne(
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

        // Verify payment with Razorpay API
        try {
            const payment = await razorpay.payments.fetch(razorpayPaymentId);
            
            if (payment.status !== 'captured' && payment.status !== 'authorized') {
                return NextResponse.json(
                    { success: false, error: 'Payment not captured' },
                    { status: 400 }
                );
            }
        } catch (error) {
            console.error('Error fetching payment from Razorpay:', error);
            // Continue with signature verification if API call fails
        }

        // Update subscription order status
        await mongoose.connection.collection('subscriptionOrders').updateOne(
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

        // Update user subscription status
        const User = mongoose.models.User || (await import('@/models/User')).default;
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription

        // Get month name and time
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        const startMonth = monthNames[startDate.getMonth()];
        const startTime = `${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(2, '0')}:${String(startDate.getSeconds()).padStart(2, '0')}`;

        // Update User model with subscription (including startMonth and startTime)
        const userUpdateResult = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    isPremium: true,
                    subscription: {
                        status: 'active',
                        plan: 'premium',
                        startDate: startDate,
                        startMonth: startMonth,
                        startTime: startTime,
                        endDate: endDate,
                        paymentId: razorpayPaymentId,
                        orderId: razorpayOrderId,
                        amount: amount || 49
                    }
                }
            },
            { new: true } // Return updated document
        );

        console.log('✅ User model updated with subscription:', {
            userId,
            isPremium: userUpdateResult?.isPremium,
            subscriptionStatus: userUpdateResult?.subscription?.status
        });

        // Record subscription in subscriptions collection (primary source of truth)
        const subscriptionResult = await mongoose.connection.collection('subscriptions').insertOne({
            userId: new mongoose.Types.ObjectId(userId),
            orderId: razorpayOrderId,
            paymentId: razorpayPaymentId,
            amount: amount || 49,
            status: 'active',
            startDate: startDate,
            endDate: endDate,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        console.log('✅ Subscription recorded in database:', {
            subscriptionId: subscriptionResult.insertedId,
            userId,
            status: 'active',
            endDate
        });

        // Return success response
        return NextResponse.json({
            success: true,
            message: 'Subscription activated successfully',
            subscription: {
                status: 'active',
                startDate: startDate,
                endDate: endDate
            }
        });
    } catch (error: any) {
        console.error('Error verifying subscription payment:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: 'Failed to verify payment',
                details: error.message
            },
            { status: 500 }
        );
    }
}
