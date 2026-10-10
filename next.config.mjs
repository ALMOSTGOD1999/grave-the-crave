/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },

  trailingSlash: true,
};

export default nextConfig;
