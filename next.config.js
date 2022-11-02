/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["ipfs.io", "i.insider.com", "lh3.googleusercontent.com", "c.tenor.com", "", "i.imgur.com", "i.imgflip.com", "thumbs.gfycat.com", "i.redd.it", "i.pinimg.com", "img.seadn.io"],
  },
  typescript: {
    ignoreBuildErrors: true
  }
}

module.exports = nextConfig;