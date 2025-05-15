import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import { ObjectId } from "mongodb";

/**
 * API endpoint to update a user's following list
 * Efficiently handles adding large batches of IDs (up to 5k)
 * 
 * @param request The incoming request with userId and followingIds
 * @returns Response with update status
 */
export async function PUT(request: NextRequest) {
    try {
        // Parse the request body with better error handling
        let requestData;
        try {
            requestData = await request.json();
        } catch (parseError) {
            return NextResponse.json({
                error: "Invalid JSON in request body",
                details: (parseError as Error).message,
                help: "Make sure your JSON is properly formatted with double quotes around property names"
            }, { status: 400 });
        }

        const { userId } = requestData;

        // Validate parameters
        if (!userId) {
            return NextResponse.json(
                { error: "Missing required parameter: userId" },
                { status: 400 }
            );
        }


        var followingIds: any[] = [];
        // Generate 5000 ObjectIds
        for (let i = 0; i < 5000; i++) {
            followingIds.push(new ObjectId().toString());
        }



        if (!followingIds || !Array.isArray(followingIds)) {
            return NextResponse.json(
                { error: "Missing or invalid followingIds: must be an array" },
                { status: 400 }
            );
        }

        // Validate each ID in the array
        const validFollowingIds = followingIds.filter(id => {
            try {
                return ObjectId.isValid(id) || typeof id === "string";
            } catch (e) {
                return false;
            }
        });

        // Connect to MongoDB
        const { db } = await connectDB();
        const userProfilesCollection = db.collection("user_profiles");

        // Check if user exists
        const userObjectId = new ObjectId(userId);
        const userExists = await userProfilesCollection.findOne({ _id: userObjectId });

        if (!userExists) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Determine operation type based on query parameter
        const operationType = request.nextUrl.searchParams.get("operation") || "add";

        let updateOperation;
        switch (operationType) {
            case "add":
                // Add IDs to the followingId array (avoiding duplicates)
                updateOperation = {
                    $addToSet: { followingId: { $each: validFollowingIds } }
                };
                break;
            case "replace":
                // Replace the entire followingId array
                updateOperation = {
                    $set: { followingId: validFollowingIds }
                };
                break;
            case "remove":
                // Remove the specified IDs from the followingId array
                updateOperation = {
                    $pull: { followingId: { $in: validFollowingIds } }
                };
                break;
            default:
                return NextResponse.json(
                    { error: "Invalid operation type. Must be 'add', 'replace', or 'remove'" },
                    { status: 400 }
                );
        }

        // Update the user's profile
        const result = await userProfilesCollection.updateOne(
            { _id: userObjectId },
            updateOperation
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
            message: `Successfully ${operationType === "add" ? "added" : operationType === "replace" ? "replaced" : "removed"} following IDs`,
            modifiedCount: result.modifiedCount,
            matchedCount: result.matchedCount
        }, { status: 200 });

    } catch (error) {
        console.error("Error updating following IDs:", error);
        return NextResponse.json(
            { error: "Internal server error", details: (error as Error).message },
            { status: 500 }
        );
    }
}

/**
 * GET endpoint to retrieve a user's following list
 */
export async function GET(request: NextRequest) {
    try {
        // Get userId from query parameters
        const userId = request.nextUrl.searchParams.get("userId");

        if (!userId) {
            return NextResponse.json(
                { error: "Missing required parameter: userId" },
                { status: 400 }
            );
        }

        // Connect to MongoDB
        const { db } = await connectDB();
        const userProfilesCollection = db.collection("user_profiles");

        // Find the user
        const userObjectId = new ObjectId(userId);
        const user = await userProfilesCollection.findOne(
            { _id: userObjectId },
            { projection: { followingId: 1 } }
        );

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Return the following list
        return NextResponse.json({
            success: true,
            followingIds: user.followingId || [],
            count: user.followingId ? user.followingId.length : 0
        }, { status: 200 });

    } catch (error) {
        console.error("Error retrieving following IDs:", error);
        return NextResponse.json(
            { error: "Internal server error", details: (error as Error).message },
            { status: 500 }
        );
    }
} 