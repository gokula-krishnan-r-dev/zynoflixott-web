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
      "zynoflixott.blob.core.windows.net"
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
