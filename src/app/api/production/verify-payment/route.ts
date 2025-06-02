import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Production from "@/models/Production";
import crypto from "crypto";

// Verify the payment signature from Razorpay
function verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean {
    try {
        const razorpaySecret = process.env.RAZORPAY_KEY_SECRET || "scJ6DIWgsqJBMSippsTgaluq";
        const hmac = crypto.createHmac("sha256", razorpaySecret);
        hmac.update(orderId + "|" + paymentId);
        const generatedSignature = hmac.digest("hex");

        return generatedSignature === signature;
    } catch (error) {
        console.error("Error verifying signature:", error);
        return false;
    }
}

export async function POST(request: NextRequest) {
    try {
        const { orderId, paymentId, signature, productionId } = await request.json();

        if (!orderId || !paymentId || !signature || !productionId) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Verify payment signature
        const isValidSignature = verifyPaymentSignature(orderId, paymentId, signature);

        if (!isValidSignature) {
            return NextResponse.json(
                { error: "Invalid payment signature" },
                { status: 400 }
            );
        }

        // Connect to database
        await connectToDatabase();

        // Update production entry with payment details
        await Production.findByIdAndUpdate(productionId, {
            paymentId,
            paymentStatus: "completed",
        });

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