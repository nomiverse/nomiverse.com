/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingIncludes: {
    '/api/deck': ['./deck.html'],
  },
}

module.exports = nextConfig


// deploy trigger
