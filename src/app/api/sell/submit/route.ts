import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Production from "@/models/Production";
import { BlobServiceClient } from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";
import sell from "@/models/sell";

// Azure Blob Storage setup
const azureConfig = {
    connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING || "",
    containerNames: {
        posters: "posters",
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
const generateUniqueBlobName = (fileName: string) => {
    const fileExtension = fileName.split(".").pop();
    const uniqueId = uuidv4();
    return `${uniqueId}.${fileExtension}`;
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
        const appointmentDate = formData.get("appointmentDate") as string;
        const appointmentTime = formData.get("appointmentTime") as string;
        const file = formData.get("file") as File | null;
        console.log(formData, "formData");



        // Validate email format
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            );
        }


        // Validate appointment date (must be in the format "YYYY-MM-DD")
        const appointmentDateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!appointmentDateRegex.test(appointmentDate)) {
            return NextResponse.json(
                { error: "Appointment date must be in the format 'YYYY-MM-DD'" },
                { status: 400 }
            );
        }

        // Validate appointment time (must be in the format "HH:MM")
        const appointmentTimeRegex = /^[0-9]{2}:[0-9]{2}$/;
        if (!appointmentTimeRegex.test(appointmentTime)) {
            return NextResponse.json(
                { error: "Appointment time must be in the format 'HH:MM'" },
                { status: 400 }
            );
        }



        // Initialize production data
        let productionData: any = {
            name,
            contact,
            email,
            appointmentDate,
            appointmentTime,
            scriptUrl: "",
            originalFileName: "",
        };

        // Handle file upload (script) if provided
        if (file) {
            // Get container client for scripts
            const containerClient = getContainerClient(azureConfig.containerNames.scripts);
            await containerClient.createIfNotExists({
                access: "blob",
            });

            // Generate unique blob name
            const blobName = generateUniqueBlobName(file.name);

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

            // Update production data with script info
            productionData.scriptUrl = scriptUrl;
            productionData.scriptFileName = file.name;
        }

        // Handle poster upload if provided
        if (file) {
            // Get container client for posters
            const containerClient = getContainerClient(azureConfig.containerNames.posters);
            await containerClient.createIfNotExists({
                access: "blob",
            });

            // Generate unique blob name
            const blobName = generateUniqueBlobName(file.name);

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
            const posterUrl = blockBlobClient.url;

            // Update production data with poster info
            productionData.posterUrl = posterUrl;
            productionData.originalFileName = file.name;
        }

        // Connect to database
        await connectToDatabase();

        // Create new Production entry
        const production = await sell.create(productionData);

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