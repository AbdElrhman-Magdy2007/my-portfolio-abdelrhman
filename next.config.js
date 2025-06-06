/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb", // Support large image uploads
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/Uploads/**", // Allow images from public/Uploads
      },
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.(mp4|jpeg|jpg|svg|png)$/,
      type: "asset/resource",
      generator: {
        filename: "static/media/[name].[hash][ext]",
      },
    });
    return config;
  },
};

module.exports = nextConfig;