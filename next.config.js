/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["miro.medium.com", "raw.githubusercontent.com", "i.ytimg.com"],
  },
  // Serve ads.txt via API route for reliable Google crawler access
  async rewrites() {
    return [
      {
        source: '/ads.txt',
        destination: '/api/ads-txt',
      },
    ];
  },
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

module.exports = nextConfig;

