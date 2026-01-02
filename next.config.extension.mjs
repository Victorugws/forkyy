/**
 * Next.js config for WebExtension build
 * Exports static HTML/CSS/JS files
 * 
 * Usage: EXTENSION_BUILD=true npm run build
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export when building for extension
  ...(process.env.EXTENSION_BUILD === 'true' && {
    output: 'export',
    images: {
      unoptimized: true,
    },
    // Exclude API routes and auth routes from static export
    pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
    // Skip routes that require server-side functionality
    generateBuildId: async () => {
      return 'extension-build'
    },
  }),

  webpack: (config, { isServer }) => {
    // Monaco Editor works only on client-side
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
      // Exclude server-only modules from client bundle
      config.externals = config.externals || []
      config.externals.push('resend')
    }
    return config
  },

  // Keep existing image config for regular builds
  images: process.env.EXTENSION_BUILD !== 'true' ? {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        port: '',
        pathname: '/vi/**'
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/a/**'
      },
      {
        protocol: 'https',
        hostname: 'logo.clearbit.com',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: '',
        pathname: '/unitedstates/images/**'
      },
      {
        protocol: 'https',
        hostname: 'www.congress.gov',
        port: '',
        pathname: '/img/**'
      }
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  } : {
    unoptimized: true,
  },
}

export default nextConfig

