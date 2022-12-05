/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "localhost",
      "antler-frontend.s3.amazonaws.com",
      "a.slack-edge.com",
    ],
  },
};

module.exports = nextConfig;
