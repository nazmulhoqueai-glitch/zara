import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    domains: [],
    remotePatterns: [],
  },
  trailingSlash: false,
  assetPrefix: '',
  output: 'standalone',
};

export default nextConfig;
