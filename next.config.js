/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['i.insider.com', "ipfs.io", "lh3.googleusercontent.com"],
  },
  typescript: {
    ignoreBuildErrors: true
  }
}

module.exports = nextConfig
