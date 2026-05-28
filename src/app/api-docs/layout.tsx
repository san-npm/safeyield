import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Public API & Data Sources - Yiield',
  description: 'Access Yiield Public API for DeFi stablecoin yields. Free REST API with pools, protocols, and statistics. Built on DefiLlama, Merkl, and 100+ protocol APIs.',
  keywords: [
    'DeFi API',
    'yield farming API',
    'stablecoin yields API',
    'DefiLlama API',
    'Merkl rewards',
    'blockchain data',
    'DeFi protocols',
    'yield aggregator API',
    'REST API',
    'free API',
  ],
  openGraph: {
    title: 'Yiield Public API - Free DeFi Yield Data',
    description: 'Access aggregated stablecoin yield data through our free public API. Perfect for dashboards, bots, and integrations.',
    url: 'https://www.yiield.xyz/api-docs',
    siteName: 'Yiield',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Yiield Data Sources',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yiield Public API - Free DeFi Yield Data',
    description: 'Access aggregated stablecoin yield data through our free public API. Perfect for dashboards, bots, and integrations.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://www.yiield.xyz/api-docs',
  },
};

export default function ApiDocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
