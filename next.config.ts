/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'items-images-production.s3.us-west-2.amazonaws.com',
      'items-images-production.s3.amazonaws.com'
    ]
  }
}

module.exports = nextConfig
