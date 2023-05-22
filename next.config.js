/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["upcdn.io", "api.replicate.com", "replicate.delivery"],
  },
}

module.exports = nextConfig
