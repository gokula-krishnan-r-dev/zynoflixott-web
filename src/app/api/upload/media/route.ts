import { NextRequest, NextResponse } from 'next/server';
import { azureConfig, getContainerClient, generateUniqueBlobName, getMediaUrl } from '@/lib/azure-storage';

// Set the export config to handle large files
export const config = {
    api: {
        bodyParser: false,
        responseLimit: false,
    },
};

export async function POST(request: NextRequest) {
    try {
        const userId = request.headers.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Parse the multipart form data
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const fileType = formData.get('fileType') as string;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        if (!fileType || !['trailer', 'poster', 'video'].includes(fileType)) {
            return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
        }

        // Read file content
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
