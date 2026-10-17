import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 95],
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
