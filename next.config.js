/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["miro.medium.com", "raw.githubusercontent.com", "i.ytimg.com"],
  },

  async redirects() {
    return [
      {
        source: "/blogs/a-heartfelt-ode-and-a-tribute-to-ajjju",
        destination: "/blogs/a-heartfelt-ode-and-a-tribute-to-ajju",
        permanent: true,
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

