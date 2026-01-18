/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: "https://ai-grant-generator.onrender.com/:path*",
      },
    ];
  },
};

export default nextConfig;

