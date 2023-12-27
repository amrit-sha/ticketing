/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions.poll = 300;
    }

    return config;
  },
};
module.exports = nextConfig;
