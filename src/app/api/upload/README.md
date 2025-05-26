# Media Upload API Documentation

This directory contains API routes for uploading various media types to Azure Blob Storage.

## Available Endpoints

- `/api/upload/media` - General media upload endpoint supporting different file types
- `/api/upload/trailer` - Specifically for trailer uploads

## Media Upload Route

The `/api/upload/media` route allows uploading different types of media files to Azure Blob Storage.

### Required Headers
- `userId` - ID of the user uploading the file

### Form Data Parameters
- `file` - The file to upload
- `fileType` - Type of file. Must be one of: `trailer`, `poster`, or `video`

### Response
```json
{
  "success": true,
  "fileUrl": "https://url-to-access-the-file.com",
  "directUrl": "https://original-azure-blob-url.com",
  "fileName": "original-filename.mp4",
  "fileType": "video",
  "fileSize": 12345678,
  "contentType": "video/mp4"
}
```

## Environment Variables

The following environment variables are required:

```
AZURE_STORAGE_CONNECTION_STRING=your_connection_string
AZURE_STORAGE_ACCOUNT_NAME=your_account_name
AZURE_STORAGE_ACCOUNT_KEY=your_account_key
USE_MEDIA_PROXY=true  # Optional: enable media proxy for better playback
NEXT_PUBLIC_API_URL=https://your-api-url.com  # For proxy URL generation
```

## Video Playback

For videos and trailers, the system can use a proxy endpoint to improve playback compatibility:

- When `USE_MEDIA_PROXY=true`, the API returns a URL through `/api/video-proxy`
- This proxy handles streaming, range requests, and CORS issues
- For direct access to the original Azure URL, use the `directUrl` field in the response

## Best Practices

1. Always validate file types on the client-side before uploading
2. Implement proper authentication and authorization
3. Consider file size limits (especially for video files)
4. Use the video proxy for better cross-browser compatibility 