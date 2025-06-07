import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import connectToDatabase from "@/lib/mongodb";
import Production from "@/models/Production";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
    try {
        const { productionId } = await request.json();

        if (!productionId) {
            return NextResponse.json(
                { error: "Production ID is required" },
                { status: 400 }
            );
        }

        // Connect to database
        await connectToDatabase();

        // Find production entry
        const production = await Production.findById(productionId);
        if (!production) {
            return NextResponse.json(
                { error: "Production not found" },
                { status: 404 }
            );
        }

        // Create Razorpay instance
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID || "rzp_live_2wtNMTtIzCco0O",
            key_secret: process.env.RAZORPAY_KEY_SECRET || "",
        });

        // Create order
        const options = {
            amount: 500 * 100, // amount in paise (500 rupees)
            currency: "INR",
            receipt: `receipt_${uuidv4().substring(0, 8)}`,
        };

        const order = await razorpay.orders.create(options);

        // Update production with order details
        production.paymentOrderId = order.id;
        await production.save();

        return NextResponse.json({
            orderId: order.id,
            amount: 500, // amount in rupees
            currency: "INR",
        });
    } catch (error) {
        console.error("Error creating payment order:", error);
        return NextResponse.json(
            { error: "Failed to create payment order" },
            { status: 500 }
        );
    }
} 