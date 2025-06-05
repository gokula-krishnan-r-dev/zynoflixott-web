import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import connectToDatabase from "@/lib/mongodb";
import FilmSubmission from "@/models/FilmSubmission";
import { getContainerClient, generateUniqueBlobName, azureConfig } from "@/lib/azure-storage";

export async function POST(request: NextRequest) {
    try {
        // Get form data
        const formData = await request.formData();

        // Extract form fields
        const fullName = formData.get("fullName") as string;
        const email = formData.get("email") as string;
        const filmTitle = formData.get("filmTitle") as string;
        const genre = formData.get("genre") as string;
        const synopsis = formData.get("synopsis") as string;
        const filmLink = formData.get("filmLink") as string;
        const scriptFile = formData.get("scriptFile") as File | null;

        // Validate required fields
        if (!fullName || !email || !filmTitle || !genre || !synopsis || !filmLink) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            );
        }

        let scriptPdfUrl = "";
        let originalFileName = "";

        // Handle script PDF file upload (if provided)
        if (scriptFile) {
            // Validate file type (PDF only)
            if (scriptFile.type !== "application/pdf") {
                return NextResponse.json(
                    { error: "Only PDF files are allowed for scripts" },
                    { status: 400 }
                );
            }

            // Check file size (10MB max)
            const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
            if (scriptFile.size > MAX_FILE_SIZE) {
                return NextResponse.json(
                    { error: "File size exceeds the 10MB limit" },
                    { status: 400 }
                );
            }

            // Get container client for scripts
            const containerClient = getContainerClient(azureConfig.containerNames.scripts);
            await containerClient.createIfNotExists({
                access: "blob",
            });

            // Generate unique blob name
            const userId = uuidv4(); // Generate a unique ID for the submission
            const blobName = generateUniqueBlobName(userId, scriptFile.name);

            // Get blob client
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);

            // Convert file to ArrayBuffer and then to Buffer
            const fileBuffer = Buffer.from(await scriptFile.arrayBuffer());

            // Upload to Azure Blob Storage
            await blockBlobClient.uploadData(fileBuffer, {
                blobHTTPHeaders: {
                    blobContentType: scriptFile.type,
                },
            });

            // Save the URL and original filename
            scriptPdfUrl = blockBlobClient.url;
            originalFileName = scriptFile.name;
        }

        // Connect to MongoDB
        await connectToDatabase();

        // Create new film submission record
        const submission = await FilmSubmission.create({
            fullName,
            email,
            filmTitle,
            genre,
            synopsis,
            filmLink,
            scriptPdfUrl,
            originalFileName,
            status: "pending"
        });

        // Return success response
        return NextResponse.json({
            success: true,
            message: "Film submission received successfully",
            submissionId: submission._id
        });

    } catch (error) {
        console.error("Error processing film submission:", error);
        return NextResponse.json(
            { error: "Failed to process film submission" },
            { status: 500 }
        );
    }
}