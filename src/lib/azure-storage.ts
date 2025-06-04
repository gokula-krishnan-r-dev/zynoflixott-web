import { BlobServiceClient, ContainerClient, BlobSASPermissions } from '@azure/storage-blob';

// Azure Storage Configuration
export const azureConfig = {
    connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING || '',
    accountName: process.env.AZURE_STORAGE_ACCOUNT_NAME || '',
    accountKey: process.env.AZURE_STORAGE_ACCOUNT_KEY || '',
    containerNames: {
        trailers: 'trailers',
        posters: 'posters',
        videos: 'videos',
        scripts: 'scripts'
    },
    // Whether to use proxy endpoint for media playback
    useProxy: process.env.USE_MEDIA_PROXY === 'true'
};

// Get a container client
export const getContainerClient = (containerName: string): ContainerClient => {
    if (!azureConfig.connectionString) {
        throw new Error('Azure Storage connection string is not configured');
    }

    const blobServiceClient = BlobServiceClient.fromConnectionString(azureConfig.connectionString);
    return blobServiceClient.getContainerClient(containerName);
};

// Generate SAS URL for direct uploads (can be used for client-side uploads)
export const generateSasUrl = async (containerName: string, blobName: string, permissions: BlobSASPermissions, expiryMinutes = 60) => {
    const containerClient = getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);

    // Create SAS URL with appropriate permissions
    const sasUrl = await blobClient.generateSasUrl({
        permissions: permissions,
        expiresOn: new Date(new Date().valueOf() + expiryMinutes * 60 * 1000)
    });

    return sasUrl;
};

// Helper function to generate a unique blob name
export const generateUniqueBlobName = (userId: string, fileName: string) => {
    const fileExtension = fileName.split('.').pop();
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 10);

    return `${userId}/${timestamp}-${randomString}.${fileExtension}`;
};

/**
 * Get a media URL that works for client-side playback
 * Handles proxying if enabled in configuration
 * 
 * @param directUrl The direct Azure Blob URL
 * @param fileType The type of media (video, trailer, poster)
 * @returns A URL that can be used for playback or display
 */
export const getMediaUrl = (directUrl: string, fileType?: string): string => {
    if (!directUrl) return '';

    // If proxy is disabled or it's not a video/trailer, return direct URL
    if (!azureConfig.useProxy || (fileType && !['video', 'trailer'].includes(fileType))) {
        return directUrl;
    }

    // For videos and trailers with proxy enabled, return proxied URL
    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
        return `${baseUrl}/api/video-proxy?url=${encodeURIComponent(directUrl)}&azure=true`;
    } catch (error) {
        console.error('Error creating media URL:', error);
        return directUrl; // Fallback to direct URL in case of error
    }
}; 