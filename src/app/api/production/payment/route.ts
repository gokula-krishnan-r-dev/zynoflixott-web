import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Production from "@/models/Production";
import Razorpay from "razorpay";

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "rzp_live_2wtNMTtIzCco0O",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "scJ6DIWgsqJBMSippsTgaluq",
});

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

        // Find the production entry
        const production = await Production.findById(productionId);

        if (!production) {
            return NextResponse.json(
                { error: "Production not found" },
                { status: 404 }
            );
        }

        // Fixed amount - 100 INR as mentioned in the requirements
        const amount = 10000; // 100 INR in paise (smallest unit)

        // Create order in Razorpay
        const orderOptions = {
            amount,
            currency: "INR",
            receipt: `prod_${productionId}`,
            notes: {
                productionId: productionId,
                name: production.name,
                email: production.email,
            },
        };

        const order = await razorpay.orders.create(orderOptions);

        // Update production entry with order ID
        await Production.findByIdAndUpdate(productionId, {
            orderId: order.id,
            paymentAmount: amount / 100, // Convert from paise to INR for storing
        });

        return NextResponse.json({
            success: true,
            orderId: order.id,
            amount: amount / 100,
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