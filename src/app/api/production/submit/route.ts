import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Production from "@/models/Production";
import { BlobServiceClient } from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";

// Azure Blob Storage setup
const azureConfig = {
    connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING || "",
    containerNames: {
        posters: "posters",
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
        const fullName = formData.get("name") as string;
        const email = formData.get("email") as string;
        const phoneNumber = formData.get("contact") as string;
        const cityState = formData.get("cityState") as string || "";
        const shortFilmTitle = formData.get("shortFilmTitle") as string || "";
        const runtime = formData.get("runtime") as string || "";
        const filmLanguage = formData.get("filmLanguage") as string || "";
        const isReleased = formData.get("isReleased") as string || "false";
        const driveLink = formData.get("driveLink") as string || "";
        const synopsis = formData.get("synopsis") as string || "";
        const appointmentDate = formData.get("appointmentDate") as string;
        const appointmentTime = formData.get("appointmentTime") as string;
        const budget = formData.get("budget") as string || "";
        const rightsType = formData.get("rightsType") as string || "";
        const additionalNotes = formData.get("additionalNotes") as string || "";
        const poster = formData.get("poster") as File | null;
        const file = formData.get("file") as File | null;

        // Validate form data
        if (
            !fullName ||
            !email ||
            !phoneNumber ||
            !appointmentDate ||
            !appointmentTime
        ) {
            return NextResponse.json(
                { error: "All required fields must be filled" },
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

        // Initialize production data
        let productionData: any = {
            fullName,
            email,
            phoneNumber,
            cityState,
            shortFilmTitle,
            runtime,
            filmLanguage,
            isReleased,
            driveLink,
            synopsis,
            appointmentDate,
            appointmentTime,
            budget,
            rightsType,
            additionalNotes,
            posterUrl: "",
            originalFileName: "",
            paymentStatus: "pending",
            status: "pending",
        };

        // Handle file upload (script) if provided
        if (file) {
            // Validate file type (PDF only)
            if (file.type !== "application/pdf") {
                return NextResponse.json(
                    { error: "Only PDF files are allowed for script" },
                    { status: 400 }
                );
            }

            // Check file size (10MB max)
            const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
            if (file.size > MAX_FILE_SIZE) {
                return NextResponse.json(
                    { error: "Script file size exceeds the 10MB limit" },
                    { status: 400 }
                );
            }

            // Get container client for scripts (using the posters container for now)
            const containerClient = getContainerClient(azureConfig.containerNames.posters);
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
            const fileUrl = blockBlobClient.url;

            // Update production data with script info
            productionData.scriptUrl = fileUrl;
            productionData.scriptFileName = file.name;
        }

        // Handle poster upload if provided
        if (poster) {
            // Validate file type (image only)
            if (!poster.type.startsWith("image/")) {
                return NextResponse.json(
                    { error: "Only image files are allowed for poster" },
                    { status: 400 }
                );
            }

            // Check file size (5MB max)
            const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
            if (poster.size > MAX_FILE_SIZE) {
                return NextResponse.json(
                    { error: "Poster file size exceeds the 5MB limit" },
                    { status: 400 }
                );
            }

            // Get container client for posters
            const containerClient = getContainerClient(azureConfig.containerNames.posters);
            await containerClient.createIfNotExists({
                access: "blob",
            });

            // Generate unique blob name
            const userId = uuidv4(); // Generate a unique ID for non-logged-in users
            const blobName = generateUniqueBlobName(userId, poster.name);

            // Get blob client
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);

            // Convert file to ArrayBuffer and then to Buffer
            const fileBuffer = Buffer.from(await poster.arrayBuffer());

            // Upload to Azure Blob Storage
            await blockBlobClient.uploadData(fileBuffer, {
                blobHTTPHeaders: {
                    blobContentType: poster.type,
                },
            });

            // Get the direct URL
            const posterUrl = blockBlobClient.url;

            // Update production data with poster info
            productionData.posterUrl = posterUrl;
            productionData.originalFileName = poster.name;
        }

        // Connect to database
        await connectToDatabase();

        // Create new Production entry
        const production = await Production.create(productionData);

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