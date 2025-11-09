/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  productionBrowserSourceMaps: false,
  // Optimize for Cloudflare Pages
  reactStrictMode: true,
  // Image optimization for Cloudflare
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Use default loader for Cloudflare
    loader: 'default',
  },
  // Output configuration for static export (if needed)
  // Uncomment if you want to deploy as static site
  // output: 'export',
  // Reduce file watching load in development
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
  // Cloudflare Pages compatibility
  experimental: {
    workerThreads: false,
    cpus: 1
  },
  // Environment variables
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  }
};

module.exports = nextConfig;
