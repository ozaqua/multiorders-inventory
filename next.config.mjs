/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable external connections that might trigger DNS requests
  images: {
    domains: ['localhost'],
    unoptimized: process.env.NODE_ENV === 'development'
  },
  // Minimize external requests during development
  // Disable automatic static optimization that might cause external requests
  trailingSlash: false,
  // Disable webpack bundle analyzer and other external tools
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Disable hot reload refresh that might trigger external requests
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    return config
  }
};

export default nextConfig;
