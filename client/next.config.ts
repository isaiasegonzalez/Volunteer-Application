import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  api: {
    bodyParser: true, // Ensure API routes process JSON payloads
  },
};

export default nextConfig;
