/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    optimizePackageImports: ['@heroicons/react'],
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  webpack: (config, { isServer }) => {
    // Ottimizzazioni webpack
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
      chunkIds: 'deterministic'
    }
    return config
  }
}

export default nextConfig 