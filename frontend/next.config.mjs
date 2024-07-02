/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_ALLOWED_IMAGE_DOMAIN,
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337'
      }
    ],
  },
  experimental: {
    serverSourceMaps: true,
  },
};

export default nextConfig;
