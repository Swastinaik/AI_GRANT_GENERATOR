/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://ai-grant-generator.onrender.com/:path*",
      },
    ];
  },
};

export default nextConfig;

