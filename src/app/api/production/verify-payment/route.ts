import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectToDatabase from "@/lib/mongodb";
import Production from "@/models/Production";

export async function POST(request: NextRequest) {
    try {
        const { orderId, paymentId, signature, productionId } = await request.json();

        if (!orderId || !paymentId || !signature || !productionId) {
            return NextResponse.json(
                { error: "All payment details are required" },
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

        // Verify signature
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
            .update(`${orderId}|${paymentId}`)
            .digest("hex");

        if (generatedSignature !== signature) {
            // Update production status
            production.paymentStatus = "failed";
            await production.save();

            return NextResponse.json(
                { error: "Invalid payment signature" },
                { status: 400 }
            );
        }

        // Update production with payment details
        production.paymentId = paymentId;
        production.paymentSignature = signature;
        production.paymentStatus = "completed";
        await production.save();

        return NextResponse.json({
            success: true,
            message: "Payment verified successfully",
        });
    } catch (error) {
        console.error("Error verifying payment:", error);
        return NextResponse.json(
            { error: "Failed to verify payment" },
            { status: 500 }
        );
    }
} 