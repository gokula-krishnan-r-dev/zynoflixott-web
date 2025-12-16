/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "etubees.s3.us-east-1.amazonaws.com",
      "i.ytimg.com",
      "i.sstatic.net",
      "via.placeholder.com",
      "room-booking-infygru.s3.ap-south-1.amazonaws.com",
      "zynoflix.s3.ap-south-1.amazonaws.com",
      "zynoflixott.blob.core.windows.net",
      'm.media-amazon.com',
      "img.etimg.com",
      'variety.com',
      'upload.wikimedia.org',
      "www.koimoi.com",
      'pbs.twimg.com',
      "static.toiimg.com",
      "placehold.co",
      "ott.blob.core.windows.net"
    ],
  },
  experimental: {
    serverActions: {
      // Allow streaming responses for video data
      allowedOrigins: ['*'],
      allowedForwardedHosts: ['*'],
    },
  },
  api: {
    bodyParser: {
      sizeLimit: '100mb', // Increase the size limit for API routes
    },
    responseLimit: false, // Remove the response size limit
  },
};

export default nextConfig;
