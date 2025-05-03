import { NextRequest, NextResponse } from 'next/server';

/**
 * Video proxy with streaming support and range requests
 */
export async function GET(request: NextRequest) {
  try {
    const videoUrl = request.nextUrl.searchParams.get('url');
    
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
    
    // Attempt to fetch the video resource
    const response = await fetch(decodedUrl, { headers });
    
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
      responseHeaders.set('Content-Type', 'video/mp4');
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
    
    if (!videoUrl) {
      return NextResponse.json(
        { error: 'Missing video URL parameter' },
        { status: 400 }
      );
    }

    const decodedUrl = decodeURIComponent(videoUrl);
    const response = await fetch(decodedUrl, { method: 'HEAD' });
    
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