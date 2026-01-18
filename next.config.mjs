/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  // Compression and caching
  compress: true,
  poweredByHeader: false,
  // React optimizations
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
