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

  // Same-origin API proxy: the browser calls https://<site>/api/*, and the
  // standalone server forwards to the api container on the compose network.
  // NEXT_PUBLIC_API_URL therefore equals the site origin in production.
  async rewrites() {
    const apiTarget = process.env.API_PROXY_TARGET || "http://api:3333";
    return [
      {
        source: "/api/:path*",
        destination: `${apiTarget}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
