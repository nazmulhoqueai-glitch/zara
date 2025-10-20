import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    domains: [
      'firebasestorage.googleapis.com'
    ],
    remotePatterns: [],
  },
  trailingSlash: false,
  assetPrefix: '',
  output: 'standalone',
};

export default nextConfig;
