/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "etubees.s3.us-east-1.amazonaws.com",
      "i.ytimg.com",
      "i.sstatic.net",
      "via.placeholder.com",
    ],
  },
};

export default nextConfig;
