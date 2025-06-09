import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectToDatabase from "@/lib/mongodb";
import sell from "@/models/sell";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { orderId, paymentId, signature, productionId } = body;

        // Verify Razorpay signature
        const text = orderId + "|" + paymentId;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
            .update(text)
            .digest("hex");

        if (expectedSignature !== signature) {
            return NextResponse.json(
                { error: "Invalid payment signature" },
                { status: 400 }
            );
        }

        // Connect to database
        await connectToDatabase();

        // Update submission status
        const submission = await sell.findByIdAndUpdate(
            productionId,
            {
                paymentId,
                orderId,
                paymentStatus: "completed",
                status: "scheduled",
            },
            { new: true }
        );

        if (!submission) {
            return NextResponse.json(
                { error: "Submission not found" },
                { status: 404 }
            );
        }

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