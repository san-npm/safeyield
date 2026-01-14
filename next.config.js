const withNextIntl = require('next-intl/plugin')('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Pour Aleph Cloud - pas de server-side rendering
  experimental: {
    // Optimisations pour le build statique
  },
};

module.exports = withNextIntl(nextConfig);
