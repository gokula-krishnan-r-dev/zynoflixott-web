import { NextRequest, NextResponse } from 'next/server';
import { azureConfig, getContainerClient, generateUniqueBlobName, getMediaUrl } from '@/lib/azure-storage';

// Updated route segment config for App Router with maximum body size settings
export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';
export const preferredRegion = 'auto';
export const maxDuration = 300; // 5 minutes timeout for large uploads

export async function POST(request: NextRequest) {
    try {
        const userId = request.headers.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get content length to check if it's within limits
        const contentLength = request.headers.get('content-length');
        if (contentLength && parseInt(contentLength) > 100 * 1024 * 1024) { // 100MB
            return NextResponse.json({
                error: 'File too large',
                message: 'Maximum file size is 100MB'
            }, { status: 413 });
        }

        // Parse the multipart form data with a specific boundary to handle large files
        let formData;
        try {
            formData = await request.formData();
        } catch (error) {
            console.error('Error parsing form data:', error);
            return NextResponse.json({
                error: 'Error parsing upload data',
                message: 'The server could not process your upload. Please try with a smaller file.'
            }, { status: 400 });
        }

        const file = formData.get('file') as File;
        const fileType = formData.get('fileType') as string;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        if (!fileType || !['trailer', 'poster', 'video'].includes(fileType)) {
            return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
        }

        // Validate file size directly
        if (file.size > 100 * 1024 * 1024) { // 100MB limit
            return NextResponse.json({
                error: 'File too large',
                message: 'Maximum file size is 100MB'
            }, { status: 413 });
        }

        // Read file content in chunks to prevent memory issues
        const fileBuffer = await file.arrayBuffer();

        // Define container name based on file type
        let containerName = '';
        switch (fileType) {
            case 'trailer':
                containerName = azureConfig.containerNames.trailers;
                break;
            case 'poster':
                containerName = azureConfig.containerNames.posters;
                break;
            case 'video':
                containerName = azureConfig.containerNames.videos;
                break;
            default:
                containerName = 'media';
        }

        // Get container client - create container if not exists
        const containerClient = getContainerClient(containerName);
        await containerClient.createIfNotExists({
            access: 'blob' // Public access level
        });

        // Generate a unique blob name using the helper function
        const blobName = generateUniqueBlobName(userId, file.name);

        // Get blob client
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        // Set appropriate content type
        const contentType = file.type;

        // Upload data with optimized settings for large files
        try {
            await blockBlobClient.uploadData(Buffer.from(fileBuffer), {
                blobHTTPHeaders: {
                    blobContentType: contentType
                },
                // Add chunking for better performance with large files
                concurrency: 20,
                onProgress: (progress) => {
                    console.log(`Upload progress: ${progress.loadedBytes} bytes`);
                }
            });
        } catch (error) {
            console.error('Error uploading to Azure Blob Storage:', error);
            return NextResponse.json({
                error: 'Failed to upload to storage',
                message: 'The file could not be uploaded to the storage server.'
            }, { status: 500 });
        }

        // Get the direct URL from the blockBlobClient
        const directUrl = blockBlobClient.url;

        // Process the URL to ensure it's playable for the client
        const playableUrl = getMediaUrl(directUrl, fileType);

        return NextResponse.json({
            success: true,
            fileUrl: playableUrl,
            directUrl: directUrl, // Include the direct URL as well for reference
            fileName: file.name,
            fileType: fileType,
            fileSize: file.size,
            contentType: contentType
        });

    } catch (error) {
        console.error('Error uploading to Azure:', error);
        return NextResponse.json({
            error: 'Failed to upload file',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
