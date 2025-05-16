import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import { ObjectId } from "mongodb";

export async function PUT(request: NextRequest) {
    try {
        // Parse the request body
        const { userId, about } = await request.json();

        // Validate parameters
        if (!userId || !about) {
            return NextResponse.json(
                { error: "Missing required parameters: userId and about" },
                { status: 400 }
            );
        }

        // Connect to MongoDB
        const { db } = await connectDB();
        const userProfilesCollection = db.collection("user_profiles");

        // Update the user's about section
        const userObjectId = new ObjectId(userId);
        const result = await userProfilesCollection.updateOne(
            { _id: userObjectId },
            { $set: { about: about } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Return success response
        return NextResponse.json({
            success: true,
            message: "About section updated successfully"
        }, { status: 200 });

    } catch (error) {
        console.error("Error updating about section:", error);
        return NextResponse.json(
            { error: "Internal server error", details: (error as Error).message },
            { status: 500 }
        );
    }
} 