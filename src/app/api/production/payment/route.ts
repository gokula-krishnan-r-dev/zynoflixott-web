import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import connectToDatabase from "@/lib/mongodb";
import sell from "@/models/sell";

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { productionId } = body;

        if (!productionId) {
            return NextResponse.json(
                { error: "Production ID is required" },
                { status: 400 }
            );
        }

        // Connect to database
        await connectToDatabase();

        // Find submission
        const submission = await sell.findById(productionId);
        if (!submission) {
            return NextResponse.json(
                { error: "Submission not found" },
                { status: 404 }
            );
        }

        // Create Razorpay order
        const orderOptions = {
            amount: 10000, // ₹100 in paise
            currency: "INR",
            receipt: productionId,
            payment_capture: true, // Auto capture payment
        };

        const order = await razorpay.orders.create(orderOptions);

        // Update submission with order ID
        await sell.findByIdAndUpdate(productionId, {
            orderId: order.id,
        });

        return NextResponse.json({
            success: true,
            orderId: order.id,
        });
    } catch (error) {
        console.error("Error creating payment order:", error);
        return NextResponse.json(
            { error: "Failed to create payment order" },
            { status: 500 }
        );
    }
} 