import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import crypto from "crypto";
import Ticket from "@/models/Ticket";
import LiveStream from "@/models/LiveStream";

// MongoDB connection
const connectMongoDB = async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            return mongoose.connection;
        }
        const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/ott";
        await mongoose.connect(uri);
        return mongoose.connection;
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
};

// Verify Razorpay signature
const verifySignature = (razorpaySignature: string, body: string) => {
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
        .update(body)
        .digest("hex");

    return expectedSignature === razorpaySignature;
};

export async function POST(request: NextRequest) {
    try {
        // Get the webhook data
        const body = await request.text();
        const razorpaySignature = request.headers.get("x-razorpay-signature") || "";

        // Verify the signature
        if (!verifySignature(razorpaySignature, body)) {
            return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }

        // Parse the webhook data
        const webhookData = JSON.parse(body);
        const { event, payload } = webhookData;

        // Connect to MongoDB
        await connectMongoDB();

        // Handle payment events
        if (event === "payment.authorized" || event === "payment.captured") {
            const { payment, order } = payload;

            // Extract user information from notes
            const userId = order.notes.userId;
            const eventId = order.notes.eventId;

            // Create or update ticket based on webhook
            await handleTicketCreation(userId, eventId, payment.id, order.id, payment.amount / 100);

            return NextResponse.json({ success: true });
        }

        // Handle payment failure events
        if (event === "payment.failed") {
            const { payment, order } = payload;

            // Log payment failures for debugging
            console.log(`Payment failed for order ${order.id}: ${payment.error_code} - ${payment.error_description}`);

            return NextResponse.json({ success: true });
        }

        // Return success for other webhook events
        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Razorpay webhook error:", error);
        return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
    }
}

// Function to handle ticket creation based on webhook data
async function handleTicketCreation(userId: string, eventId: string, paymentId: string, orderId: string, amount: number) {
    try {
        // Check if ticket already exists
        const existingTicket = await Ticket.findOne({ orderId });

        if (existingTicket) {
            // Update existing ticket status if needed
            if (existingTicket.status !== "active") {
                await Ticket.findByIdAndUpdate(existingTicket._id, {
                    status: "active",
                    paymentId
                });
            }
            return;
        }

        // Check if the event exists
        const event = await LiveStream.findById(eventId);
        if (!event) {
            throw new Error(`Event not found: ${eventId}`);
        }

        // Create new ticket
        const newTicket = await Ticket.create({
            userId,
            eventId,
            paymentId,
            orderId,
            amount,
            purchaseDate: new Date(),
            status: "active"
        });

        // Increment ticket count on the event
        await LiveStream.findByIdAndUpdate(eventId, {
            $inc: { ticketsSold: 1 }
        });

        console.log(`Ticket created from webhook: ${newTicket._id}`);

    } catch (error) {
        console.error("Error creating ticket from webhook:", error);
        throw error;
    }
} 