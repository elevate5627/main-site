#!/bin/bash

# Cloudflare Pages Build Script
# This script ensures the build process works correctly on Cloudflare Pages

echo "🚀 Starting Cloudflare Pages build..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --legacy-peer-deps

# Type check (optional, comment out if it slows down build)
# echo "🔍 Running type check..."
# npm run typecheck

# Build the Next.js application
echo "🏗️ Building Next.js application..."
npm run build

# Verify build output
if [ -d ".next" ]; then
  echo "✅ Build completed successfully!"
  echo "📁 Build output directory: .next"
  ls -la .next
else
  echo "❌ Build failed - .next directory not found"
  exit 1
fi

echo "🎉 Cloudflare Pages build completed!"
