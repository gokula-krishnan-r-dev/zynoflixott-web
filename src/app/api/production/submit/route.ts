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

// Validate Azure Storage connection string
const validateAzureConfig = () => {
    if (!azureConfig.connectionString) {
        throw new Error("Azure Storage connection string is not configured. Please set AZURE_STORAGE_CONNECTION_STRING environment variable.");
    }
    
    // Basic validation of connection string format
    if (!azureConfig.connectionString.includes("AccountName=") || 
        !azureConfig.connectionString.includes("AccountKey=")) {
        throw new Error("Azure Storage connection string appears to be invalid. Please check your AZURE_STORAGE_CONNECTION_STRING environment variable.");
    }
};

// Get container client
const getContainerClient = (containerName: string) => {
    validateAzureConfig();
    
    try {
        const blobServiceClient = BlobServiceClient.fromConnectionString(
            azureConfig.connectionString
        );
        return blobServiceClient.getContainerClient(containerName);
    } catch (error: any) {
        console.error("Failed to create Azure Blob Storage client:", error);
        throw new Error(`Failed to connect to Azure Storage: ${error.message || "Unknown error"}`);
    }
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
        const fullName = formData.get("fullName") as string;
        const email = formData.get("email") as string;
        const phoneNumber = formData.get("phoneNumber") as string;
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
        console.log(formData, "formData");


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

            try {
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
            } catch (uploadError: any) {
                console.error("Azure Blob Storage upload error:", uploadError);
                
                // Check for specific error types
                if (uploadError.code === "ENOTFOUND") {
                    return NextResponse.json(
                        { 
                            error: "Cannot connect to Azure Storage. Please verify:",
                            details: [
                                "1. The Azure Storage account name is correct",
                                "2. The storage account exists and is accessible",
                                "3. Your network connection is working",
                                "4. The connection string in .env.local is correct"
                            ]
                        },
                        { status: 500 }
                    );
                }
                
                throw uploadError; // Re-throw to be caught by outer catch
            }
        }

        // Connect to database
        await connectToDatabase();

        // Create new Production entry
        const production = await Production.create(productionData);

        return NextResponse.json({
            success: true,
            productionId: production._id,
        });
    } catch (error: any) {
        console.error("Error in production submission:", error);
        
        // Provide more specific error messages
        let errorMessage = "Failed to submit production form";
        let errorDetails: string[] = [];
        
        if (error.message) {
            errorMessage = error.message;
        }
        
        if (error.code === "ENOTFOUND") {
            errorMessage = "Cannot connect to Azure Storage";
            errorDetails = [
                "The Azure Storage account might not exist or the hostname cannot be resolved.",
                "Please verify:",
                "- The storage account name 'zynoflixott' is correct",
                "- The storage account exists in your Azure subscription",
                "- Your network connection is working",
                "- The AZURE_STORAGE_CONNECTION_STRING in .env.local is correct"
            ];
        }
        
        return NextResponse.json(
            { 
                error: errorMessage,
                ...(errorDetails.length > 0 && { details: errorDetails })
            },
            { status: 500 }
        );
    }
} 