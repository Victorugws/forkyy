/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
        pathname: '/a/**' // Google user content often follows this pattern
      }
    ]
  },
  webpack: (config) => {
    // Fix zod v3/v4 import issues with AI SDK
    config.resolve.alias = {
      ...config.resolve.alias,
      'zod/v3': 'zod',
      'zod/v4': 'zod',
    }
    return config
  },
}

export default nextConfig
