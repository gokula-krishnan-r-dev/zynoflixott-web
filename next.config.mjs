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
      "static.toiimg.com"
    ],
  },
  experimental: {
    serverActions: {
      // Allow streaming responses for video data
      allowedOrigins: ['*'],
      allowedForwardedHosts: ['*'],
    },
  },
};

export default nextConfig;
