/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ["framer-motion"],
    optimizeCss: true,
  },

  // Optimize for Cloudflare Pages deployment
  trailingSlash: true,

  // Webpack optimization to reduce file sizes and prevent cache issues
  webpack: (config, { isServer, dev }) => {
    // Only apply optimizations in production
    if (!dev) {
      // Reduce chunk sizes to stay under Cloudflare's 25MB limit
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          maxSize: 20000000, // 20MB limit per chunk
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendors",
              chunks: "all",
              maxSize: 15000000, // 15MB for vendor chunks
            },
            common: {
              name: "common",
              chunks: "all",
              minChunks: 2,
              maxSize: 10000000, // 10MB for common chunks
            },
          },
        },
      };

      // Disable webpack cache in production to prevent large cache files
      config.cache = false;
    }

    // Client-side fallbacks
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },

  // Better compatibility with @cloudflare/next-on-pages
  distDir: ".next",
};

export default nextConfig;
