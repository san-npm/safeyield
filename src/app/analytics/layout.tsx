import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Analytics - DeFi Yield Data & Protocol Comparison',
  description: 'Track stablecoin yield analytics across DeFi protocols. Compare TVL distribution, APY trends, protocol leaderboards, and find the best yield opportunities for USDC, USDT, DAI, and more.',
  keywords: [
    'DeFi analytics',
    'yield analytics',
    'stablecoin TVL',
    'protocol comparison',
    'APY tracking',
    'DeFi data',
    'yield tracking',
    'crypto yield analytics',
    'stablecoin yields comparison',
    'DeFi protocol leaderboard',
    'TVL distribution',
    'best DeFi yields data',
    // French
    'analytics DeFi',
    'comparaison rendements',
    'données yield stablecoin',
    // German
    'DeFi Analytik',
    'Rendite Vergleich',
    // Spanish
    'análisis DeFi',
    'comparación de rendimientos',
  ],
  openGraph: {
    title: 'Yield Analytics - DeFi Protocol Comparison | Yiield',
    description: 'Track stablecoin yields across DeFi. Compare TVL distribution, protocol rankings, and APY trends. Find the best opportunities.',
    url: 'https://www.yiield.xyz/analytics',
    images: [
      {
        url: 'https://www.yiield.xyz/og-analytics.png',
        width: 1200,
        height: 630,
        alt: 'Yiield Analytics - DeFi Yield Data & Comparison',
      },
    ],
    type: 'website',
    siteName: 'Yiield',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yield Analytics - DeFi Protocol Comparison | Yiield',
    description: 'Track stablecoin yields across DeFi. Compare TVL, protocol rankings, and APY trends.',
    images: ['https://www.yiield.xyz/og-analytics.png'],
    site: '@yiield',
    creator: '@yiield',
  },
  alternates: {
    canonical: 'https://www.yiield.xyz/analytics',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Schema.org for Analytics page
const analyticsSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://www.yiield.xyz/analytics',
  name: 'DeFi Yield Analytics',
  description: 'Track and compare stablecoin yields across DeFi protocols with comprehensive analytics, TVL distribution, and protocol leaderboards.',
  url: 'https://www.yiield.xyz/analytics',
  isPartOf: {
    '@type': 'WebSite',
    '@id': 'https://www.yiield.xyz/#website',
    name: 'Yiield',
    url: 'https://www.yiield.xyz',
  },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.yiield.xyz',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Analytics',
        item: 'https://www.yiield.xyz/analytics',
      },
    ],
  },
};

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(analyticsSchema) }}
      />
      {children}
    </>
  );
}
