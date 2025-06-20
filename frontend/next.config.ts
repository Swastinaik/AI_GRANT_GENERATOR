import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://ai-grant-generator.onrender.com/:path*',
      },
    ];
  }
};

export default nextConfig;
