import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    config.infrastructureLogging = { level: 'error' }; // Reduce verbose logging
    return config;
  },
  images: {
    loader: 'default',
    unoptimized: true, // Disables built-in image optimization
  },
};

export default nextConfig;
