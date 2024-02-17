/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'cdn.dribbble.com',
          },
          {
            protocol: 'http',
            hostname: 'localhost',
            port: '1337'
          }
        ],
      },
};

export default nextConfig;
