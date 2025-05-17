import { NextRequest, NextResponse } from 'next/server';

/**
 * Video proxy with streaming support and range requests
 */
export async function GET(request: NextRequest) {
  try {
    const videoUrl = request.nextUrl.searchParams.get('url');
    const isAzureBlob = request.nextUrl.searchParams.get('azure') === 'true';
    const isHlsStream = request.nextUrl.searchParams.get('type') === 'hls';
    const retryAttempt = request.nextUrl.searchParams.get('retry') || '0';

    if (!videoUrl) {
      return NextResponse.json(
        { error: 'Missing video URL parameter' },
        { status: 400 }
      );
    }

    // Decode the URL if it's encoded
    const decodedUrl = decodeURIComponent(videoUrl);

    // Gather request headers we need to pass along
    const headers = new Headers();

    // Handle range requests (critical for video seeking)
    const rangeHeader = request.headers.get('range');
    if (rangeHeader) {
      headers.set('Range', rangeHeader);
      console.log(`Proxying video request with range: ${rangeHeader}`);
    } else {
      console.log(`Proxying full video request: ${decodedUrl}`);
    }

    // Set specific headers for Azure Blob Storage to avoid CORS issues
    if (isAzureBlob) {
      // Add Azure storage specific headers
      headers.set('Origin', new URL(decodedUrl).origin);
      headers.set('x-ms-version', '2020-04-08');

      // Add cache-busting for retry attempts
      if (parseInt(retryAttempt) > 0) {
        headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        headers.set('Pragma', 'no-cache');
      }
    }

    // Set specific headers for HLS streams
    if (isHlsStream) {
      headers.set('Accept', 'application/vnd.apple.mpegurl, application/x-mpegurl, */*');
    }

    // Set Referer header to match origin of the video URL
    try {
      headers.set('Referer', new URL(decodedUrl).origin);
    } catch (e) {
      console.warn('Could not parse URL for Referer header:', e);
    }

    // Attempt to fetch the video resource
    const response = await fetch(decodedUrl, {
      headers,
      // Ensure cookies and credentials are passed for authenticated resources
      credentials: 'include',
      cache: parseInt(retryAttempt) > 0 ? 'no-store' : 'default'
    });

    // Check if the response is successful or a valid partial content response
    if (!response.ok && response.status !== 206) {
      console.error(`Failed to fetch video: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: `Failed to fetch video: ${response.statusText}` },
        { status: response.status }
      );
    }

    // Set up response headers
    const responseHeaders = new Headers();

    // Copy all headers from the original response
    response.headers.forEach((value, key) => {
      responseHeaders.set(key, value);
    });

    // Ensure necessary headers are present
    if (!responseHeaders.has('Content-Type')) {
      if (isHlsStream) {
        responseHeaders.set('Content-Type', 'application/vnd.apple.mpegurl');
      } else {
        responseHeaders.set('Content-Type', 'video/mp4');
      }
    }

    if (!responseHeaders.has('Accept-Ranges')) {
      responseHeaders.set('Accept-Ranges', 'bytes');
    }

    // Set CORS headers
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', 'Range, Content-Type, Origin, Referer');
    responseHeaders.set('Access-Control-Expose-Headers', 'Content-Length, Content-Range');

    // Create and return the streaming response
    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders
    });

  } catch (error) {
    console.error('Error proxying video:', error);
    return NextResponse.json(
      { error: 'Failed to proxy video request' },
      { status: 500 }
    );
  }
}

/**
 * Handle OPTIONS requests for CORS preflight
 */
export async function OPTIONS(request: NextRequest) {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Range, Content-Type, Origin, Referer');
  headers.set('Access-Control-Max-Age', '86400'); // 24 hours

  return new NextResponse(null, {
    status: 204, // No content
    headers
  });
}

/**
 * Handle HEAD requests for video metadata
 */
export async function HEAD(request: NextRequest) {
  try {
    const videoUrl = request.nextUrl.searchParams.get('url');
    const isAzureBlob = request.nextUrl.searchParams.get('azure') === 'true';

    if (!videoUrl) {
      return NextResponse.json(
        { error: 'Missing video URL parameter' },
        { status: 400 }
      );
    }

    const decodedUrl = decodeURIComponent(videoUrl);

    // Prepare headers for HEAD request
    const headers = new Headers();

    if (isAzureBlob) {
      // Add Azure storage specific headers
      headers.set('Origin', new URL(decodedUrl).origin);
      headers.set('x-ms-version', '2020-04-08');
    }

    // Make HEAD request
    const response = await fetch(decodedUrl, {
      method: 'HEAD',
      headers,
      credentials: 'include'
    });

    const responseHeaders = new Headers();

    // Copy all headers from the original response
    response.headers.forEach((value, key) => {
      responseHeaders.set(key, value);
    });

    // Set CORS headers
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Expose-Headers', 'Content-Length, Content-Type, Accept-Ranges');

    return new NextResponse(null, {
      status: response.status,
      headers: responseHeaders
    });

  } catch (error) {
    console.error('Error proxying HEAD request:', error);
    return NextResponse.json(
      { error: 'Failed to proxy HEAD request' },
      { status: 500 }
    );
  }
} 