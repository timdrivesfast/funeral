/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'items-images-production.s3.us-west-2.amazonaws.com',
      'items-images-production.s3.amazonaws.com',
      'square-catalog-sandbox.s3.amazonaws.com',
      'square-catalog-production.s3.amazonaws.com'
    ]
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  }
}

module.exports = nextConfig 