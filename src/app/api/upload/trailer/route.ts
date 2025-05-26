import { NextRequest, NextResponse } from 'next/server';
import { BlobServiceClient } from '@azure/storage-blob';
import { v4 as uuidv4 } from 'uuid';

// Azure Blob Storage configuration
const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING || '');
const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_STORAGE_CONTAINER || 'zynoflix');

export const maxDuration = 60; // Set max duration for the API route (in seconds)

export async function POST(request: NextRequest) {
    try {
        // Verify request headers and permissions
        const userId = request.headers.get('userId') || '';
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get the form data from the request
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Check file type
        if (!file.type.startsWith('video/')) {
            return NextResponse.json({ error: 'Invalid file type. Only video files are allowed.' }, { status: 400 });
        }

        // Check file size (100MB max)
        const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB in bytes
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ error: 'File size exceeds the 100MB limit.' }, { status: 400 });
        }

        // Generate a unique file name
        const fileExtension = file.name.split('.').pop();
        const uniqueFileName = `${userId}/${uuidv4()}.${fileExtension}`;

        // Get a block blob client
        const blockBlobClient = containerClient.getBlockBlobClient(uniqueFileName);

        // Convert file to ArrayBuffer and then to Buffer
        const fileBuffer = Buffer.from(await file.arrayBuffer());

        // Upload to Azure Blob Storage
        await blockBlobClient.upload(fileBuffer, fileBuffer.length, {
            blobHTTPHeaders: {
                blobContentType: file.type
            }
        });

        // Generate the URL for the uploaded file
        const fileUrl = blockBlobClient.url;

        // Return success response with the file URL
        return NextResponse.json({
            success: true,
            fileUrl: fileUrl,
            message: 'Trailer uploaded successfully'
        });
    } catch (error) {
        console.error('Error uploading trailer:', error);
        return NextResponse.json({
            error: 'Failed to upload trailer',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}