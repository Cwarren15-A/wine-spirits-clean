import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during build to avoid configuration issues
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Keep TypeScript checking enabled
    ignoreBuildErrors: false,
  },
  experimental: {
    optimizePackageImports: ['lucide-react']
  }
}

export default nextConfig
