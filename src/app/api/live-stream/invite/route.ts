import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import mongoose from 'mongoose';
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
    try {
        const { eventId, email } = await request.json();
        const userId = request.headers.get("userId");

        if (!userId || !eventId || !email) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        // Connect to database
        await connectToDatabase();

        // Verify user has premium access
        const user = await mongoose.connection.collection("users").findOne({
            _id: new mongoose.Types.ObjectId(userId)
        });

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        if (!user.isPremium) {
            return NextResponse.json({ success: false, message: "Premium subscription required to invite others" }, { status: 403 });
        }

        // Check if invited user exists
        const invitedUser = await mongoose.connection.collection("users").findOne({
            email: email
        });

        if (!invitedUser) {
            return NextResponse.json({ success: false, message: "Invited user not found" }, { status: 404 });
        }

        // Check if user has active session for this event
        const session = await mongoose.connection.collection("streamingSessions").findOne({
            userId: new mongoose.Types.ObjectId(userId),
            eventId: new mongoose.Types.ObjectId(eventId),
            active: true
        });

        if (!session) {
            return NextResponse.json({ success: false, message: "No active session found" }, { status: 404 });
        }

        // Check if already at max devices
        const deviceCount = await mongoose.connection.collection("streamingSessions").countDocuments({
            userId: new mongoose.Types.ObjectId(userId),
            eventId: new mongoose.Types.ObjectId(eventId),
            active: true
        });

        const maxDevices = user.isPremium ? 3 : 1;

        if (deviceCount >= maxDevices) {
            return NextResponse.json({ success: false, message: "Maximum devices reached" }, { status: 429 });
        }

        // Check if user is already invited
        const existingInvitation = await mongoose.connection.collection("streamingInvitations").findOne({
            inviterId: new mongoose.Types.ObjectId(userId),
            inviteeEmail: email,
            eventId: new mongoose.Types.ObjectId(eventId),
            status: "pending"
        });

        if (existingInvitation) {
            return NextResponse.json({ success: false, message: "User already invited" }, { status: 400 });
        }

        // Get event details
        const event = await mongoose.connection.collection("events").findOne({
            _id: new mongoose.Types.ObjectId(eventId)
        });

        if (!event) {
            return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
        }

        // Create invitation
        const invitation = {
            inviterId: new mongoose.Types.ObjectId(userId),
            inviterName: user.name || user.email,
            inviteeId: invitedUser._id,
            inviteeEmail: email,
            eventId: new mongoose.Types.ObjectId(eventId),
            eventTitle: event.movieTitle,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            status: "pending",
            token: new mongoose.Types.ObjectId().toString()
        };

        await mongoose.connection.collection("streamingInvitations").insertOne(invitation);

        // Send email notification
        const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/watch/${eventId}?invitation=${invitation.token}`;

        // Setup email transport (using environment variables)
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT) || 587,
            secure: process.env.EMAIL_SECURE === "true",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        // Send email
        await transporter.sendMail({
            from: `"Zynoflix" <${process.env.EMAIL_FROM || 'noreply@zynoflix.com'}>`,
            to: email,
            subject: `${user.name || user.email} invited you to watch "${event.movieTitle}"`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
                    <h2 style="color: #6d28d9;">You've Been Invited to Watch Together!</h2>
                    <p>${user.name || user.email} has invited you to watch "${event.movieTitle}" together on Zynoflix.</p>
                    <div style="margin: 30px 0;">
                        <a href="${inviteUrl}" style="background-color: #6d28d9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                            Join Viewing Session
                        </a>
                    </div>
                    <p>This invitation will expire in 24 hours.</p>
                    <p>Enjoy the show!</p>
                </div>
            `
        });

        return NextResponse.json({ success: true, message: "Invitation sent successfully" });

    } catch (error) {
        console.error("Error inviting user:", error);
        return NextResponse.json({ success: false, message: "Failed to send invitation" }, { status: 500 });
    }
} 