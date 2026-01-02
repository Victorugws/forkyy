/** @type {import('next').NextConfig} */

/**
 * Next.js config for WebExtension build
 * Exports static HTML/CSS/JS files
 */

const nextConfig = {
  // Static export - no server-side code
  output: 'export',
  
  // Disable image optimization (not supported in static export)
  images: {
    unoptimized: true
  },

  // Asset prefix for moz-extension:// URLs
  // Will be set dynamically in build script
  assetPrefix: process.env.EXTENSION_BASE_PATH || '',

  // Trailing slash for proper routing
  trailingSlash: true,

  // Webpack config
  webpack: (config, { isServer }) => {
    // Don't bundle Node.js modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        path: false,
        os: false,
        stream: false,
        util: false,
      }
    }

    // Handle browser APIs
    config.resolve.alias = {
      ...config.resolve.alias,
      // Replace Electron APIs with browser APIs
      '@/lib/browser-api': require.resolve('./lib/browser-api.ts'),
    }

    return config
  },

  // Disable server-side features
  reactStrictMode: true,
  
  // No API routes (they won't work in extension)
  // Keep pages that don't require server-side rendering
}

module.exports = nextConfig

