import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: "https://ai-grant-generator.onrender.com/:path*",
      },
    ];
  },
}
export default nextConfig;
