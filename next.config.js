// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   experimental: {
//     serverActions: {
//       bodySizeLimit: "5mb", // Increase max body size to 5MB
//     },
//   },
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "**", // Allow images from any HTTPS hostname
//       },
//       {
//         protocol: "http",
//         hostname: "localhost",
//         port: "3000",
//         pathname: "/Uploads/**", // Allow local uploads
//       },
//     ],
//   },
//   webpack(config) {
//     // Add rule for handling .mp4, .jpeg, .jpg, .svg, .png files
//     config.module.rules.push({
//       test: /\.(mp4|jpeg|jpg|svg|png)$/,
//       type: "asset/resource",
//       generator: {
//         filename: "static/media/[name].[hash][ext]", // Output to static/media/
//       },
//     });
//     return config;
//   },
// };

// module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
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