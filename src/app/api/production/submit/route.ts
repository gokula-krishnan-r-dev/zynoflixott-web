import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Production from "@/models/Production";
import { BlobServiceClient } from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";

// Azure Blob Storage setup
const azureConfig = {
    connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING || "",
    containerNames: {
        scripts: "scripts",
    },
};

// Get container client
const getContainerClient = (containerName: string) => {
    const blobServiceClient = BlobServiceClient.fromConnectionString(
        azureConfig.connectionString
    );
    return blobServiceClient.getContainerClient(containerName);
};

// Generate a unique blob name
const generateUniqueBlobName = (userId: string, fileName: string) => {
    const fileExtension = fileName.split(".").pop();
    const uniqueId = uuidv4();
    return `${userId}-${uniqueId}.${fileExtension}`;
};

// Get media URL
const getMediaUrl = (directUrl: string) => {
    return directUrl;
};

export async function POST(request: NextRequest) {
    try {
        // Get form data
        const formData = await request.formData();
        const name = formData.get("name") as string;
        const contact = formData.get("contact") as string;
        const email = formData.get("email") as string;
        const file = formData.get("file") as File;

        // Validate form data
        if (!name || !contact || !email || !file) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        // Validate email
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            );
        }

        // Validate file type (PDF only)
        if (file.type !== "application/pdf") {
            return NextResponse.json(
                { error: "Only PDF files are allowed" },
                { status: 400 }
            );
        }

        // Check file size (10MB max)
        const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
        if (file.size > MAX_FILE_SIZE) {
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
        const userId = uuidv4(); // Generate a unique ID for non-logged-in users
        const blobName = generateUniqueBlobName(userId, file.name);

        // Get blob client
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        // Convert file to ArrayBuffer and then to Buffer
        const fileBuffer = Buffer.from(await file.arrayBuffer());

        // Upload to Azure Blob Storage
        await blockBlobClient.uploadData(fileBuffer, {
            blobHTTPHeaders: {
                blobContentType: file.type,
            },
        });

        // Get the direct URL
        const scriptUrl = blockBlobClient.url;

        // Connect to database
        await connectToDatabase();

        // Create new Production entry
        const production = await Production.create({
            name,
            contact,
            email,
            scriptUrl,
            originalFileName: file.name,
            paymentStatus: "pending",
            status: "pending",
        });

        return NextResponse.json({
            success: true,
            productionId: production._id,
        });
    } catch (error) {
        console.error("Error in production submission:", error);
        return NextResponse.json(
            { error: "Failed to submit production form" },
            { status: 500 }
        );
    }
} 