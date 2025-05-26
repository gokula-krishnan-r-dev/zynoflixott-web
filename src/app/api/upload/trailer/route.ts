import { NextRequest, NextResponse } from 'next/server';
import { getContainerClient, generateUniqueBlobName, getMediaUrl, azureConfig } from '@/lib/azure-storage';

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

        // Get container client for trailers
        const containerClient = getContainerClient(azureConfig.containerNames.trailers);
        await containerClient.createIfNotExists({
            access: 'blob'
        });

        // Generate unique blob name
        const blobName = generateUniqueBlobName(userId, file.name);

        // Get blob client
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        // Convert file to ArrayBuffer and then to Buffer
        const fileBuffer = Buffer.from(await file.arrayBuffer());

        // Upload to Azure Blob Storage
        await blockBlobClient.uploadData(fileBuffer, {
            blobHTTPHeaders: {
                blobContentType: file.type
            }
        });

        // Get the direct URL and process it for playback
        const directUrl = blockBlobClient.url;
        const playableUrl = getMediaUrl(directUrl, 'trailer');

        // Return success response with the file URL
        return NextResponse.json({
            success: true,
            fileUrl: playableUrl,
            directUrl: directUrl,
            fileName: file.name,
            fileType: 'trailer',
            fileSize: file.size,
            contentType: file.type
        });

    } catch (error) {
        console.error('Error uploading trailer:', error);
        return NextResponse.json({
            error: 'Failed to upload trailer',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}