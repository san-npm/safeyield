import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';

// ============================================
// SEO METADATA - OPTIMISÉ POUR YIIELD.XYZ
// ============================================

export const metadata: Metadata = {
  metadataBase: new URL('https://yiield.xyz'),
  
  // Titre et description optimisés
  title: {
    default: 'Yiield - Compare Best Stablecoin Yields | DeFi APY Rates & Security Scores',
    template: '%s | Yiield - DeFi Yield Comparison',
  },
  description: 'Find the best stablecoin yields in DeFi. Compare APY rates from Aave, Compound, Morpho, Spark & more. Security scores help you invest safely in USDC, USDT, DAI, EURe yields.',
  
  // Mots-clés ciblés multilingues
  keywords: [
    // Primary English keywords (high intent)
    'best stablecoin yields',
    'stablecoin APY comparison',
    'DeFi yield rates',
    'highest USDC yield',
    'USDT APY rates',
    'DAI lending rates',
    'safe DeFi yields',
    'stablecoin interest rates 2026',
    'DeFi yield aggregator',
    'crypto passive income',
    // Long-tail English
    'best place to earn interest on stablecoins',
    'compare DeFi lending rates',
    'safest stablecoin yields',
    'Aave vs Compound yields',
    'where to stake USDC',
    // French keywords
    'meilleur rendement stablecoin',
    'comparateur yield DeFi',
    'rendement USDC France',
    'taux APY stablecoin',
    'gagner intérêts crypto',
    // German keywords
    'beste stablecoin rendite',
    'DeFi zinsen vergleich',
    'USDC zinsen',
    // Spanish keywords
    'mejor rendimiento stablecoin',
    'comparador rendimientos DeFi',
    'ganar intereses crypto',
    // Italian keywords
    'miglior rendimento stablecoin',
    'confronto yield DeFi',
    'interessi stablecoin',
    // Euro stablecoins
    'EURe yield',
    'EURC APY',
    'euro stablecoin yields',
  ],
  
  authors: [{ name: 'Yiield', url: 'https://yiield.xyz' }],
  creator: 'COMMIT MEDIA',
  publisher: 'COMMIT MEDIA',
  
  // Robots et indexation
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Open Graph optimisé
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['fr_FR', 'de_DE', 'es_ES', 'it_IT'],
    url: 'https://yiield.xyz',
    siteName: 'Yiield',
    title: 'Yiield - Best Stablecoin Yields & DeFi APY Comparison',
    description: 'Compare stablecoin yields from top DeFi protocols. Real-time APY rates with security scores for USDC, USDT, DAI, EURe. Find safe, high-yield opportunities.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Yiield - Compare Best Stablecoin Yields in DeFi',
        type: 'image/png',
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Yiield - Best Stablecoin Yields & DeFi APY Rates',
    description: 'Compare yields from Aave, Compound, Morpho & more. Security scores included.',
    images: ['/og-image.png'],
    site: '@yiield',
    creator: '@yiield',
  },
  
  // Favicon et icônes
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  
  // Verification search engines
  verification: {
    google: 'G-YYPH87DSSG',
  },
  
  // Alternates multilingues (hreflang)
  alternates: {
    canonical: 'https://yiield.xyz',
    languages: {
      'en': 'https://yiield.xyz',
      'fr': 'https://yiield.xyz',
      'de': 'https://yiield.xyz',
      'es': 'https://yiield.xyz',
      'it': 'https://yiield.xyz',
      'x-default': 'https://yiield.xyz',
    },
  },
  
  // Catégorie et autres
  category: 'finance',
  
  // App specifics
  applicationName: 'Yiield',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  
  // Additional meta
  other: {
    'msapplication-TileColor': '#0f172a',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'mobile-web-app-capable': 'yes',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0f172a' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  colorScheme: 'dark',
};

// ============================================
// SCHEMA.ORG JSON-LD - RICH SNIPPETS
// ============================================

// Schema principal WebApplication
const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  '@id': 'https://yiield.xyz/#webapp',
  name: 'Yiield',
  url: 'https://yiield.xyz',
  description: 'Compare the best stablecoin yields across DeFi protocols with security scores. Find safe, high-yield opportunities for USDC, USDT, DAI, and euro stablecoins.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web Browser',
  browserRequirements: 'Requires JavaScript',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
  },
  author: {
    '@type': 'Organization',
    name: 'COMMIT MEDIA',
    url: 'https://yiield.xyz',
  },
  publisher: {
    '@type': 'Organization',
    name: 'COMMIT MEDIA',
  },
  inLanguage: ['en', 'fr', 'de', 'es', 'it'],
  isAccessibleForFree: true,
  featureList: [
    'Real-time DeFi yield comparison',
    'Security scores for protocols',
    'Multi-chain support',
    'Stablecoin filtering',
    'APY tracking',
  ],
};

// Schema Organization
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://yiield.xyz/#organization',
  name: 'Yiield',
  url: 'https://yiield.xyz',
  logo: 'https://yiield.xyz/logo.png',
  description: 'DeFi yield comparison platform with security scores',
  foundingDate: '2026',
  sameAs: [],
};

// Schema FAQ pour rich snippets Google
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': 'https://yiield.xyz/#faq',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What are the best stablecoin yields in DeFi?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The best stablecoin yields vary by protocol and market conditions. Top protocols like Aave, Compound, Morpho, and Spark typically offer competitive rates between 3-15% APY. Yiield compares all major protocols with security scores to help you find safe opportunities.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is DeFi yield farming safe?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'DeFi yield farming carries risks including smart contract vulnerabilities, oracle failures, and market volatility. Yiield provides security scores (0-100) based on audits, protocol age, TVL, and exploit history. We recommend protocols with scores above 70 for safer investments.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between lending and vault protocols?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Lending protocols (like Aave, Compound) let you lend directly to borrowers and earn interest. Vault managers (like Morpho, Steakhouse) optimize your deposits across multiple strategies to maximize yields while managing risk.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which stablecoins offer the highest yields?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yields vary by stablecoin and protocol. Major USD stablecoins (USDC, USDT, DAI) typically offer 3-10% APY on established protocols. Euro stablecoins (EURe, EURC) may offer different rates. Always check the security score before investing.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quels sont les meilleurs rendements stablecoin en France?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Les meilleurs rendements stablecoin dépendent du protocole et des conditions de marché. Aave, Compound, Morpho et Spark offrent généralement entre 3-15% APY. Yiield compare tous les protocoles avec des scores de sécurité pour vous aider à investir en toute sécurité.',
      },
    },
    {
      '@type': 'Question',
      name: 'Welche Stablecoins bieten die höchsten Renditen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Die Renditen variieren je nach Stablecoin und Protokoll. Wichtige USD-Stablecoins (USDC, USDT, DAI) bieten typischerweise 3-10% APY auf etablierten Protokollen. Euro-Stablecoins (EURe, EURC) können unterschiedliche Zinssätze bieten. Überprüfen Sie immer den Sicherheitsscore vor einer Investition.',
      },
    },
    {
      '@type': 'Question',
      name: 'Ist DeFi Yield Farming sicher?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'DeFi Yield Farming birgt Risiken wie Smart-Contract-Schwachstellen, Oracle-Fehler und Marktvolatilität. Yiield bietet Sicherheitsscores (0-100) basierend auf Audits, Protokollalter, TVL und Exploit-Historie. Wir empfehlen Protokolle mit Scores über 70 für sicherere Investitionen.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cuáles son los mejores rendimientos de stablecoins en DeFi?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Los mejores rendimientos de stablecoins varían según el protocolo y las condiciones del mercado. Los principales protocolos como Aave, Compound, Morpho y Spark suelen ofrecer tasas competitivas entre 3-15% APY. Yiield compara todos los protocolos principales con puntuaciones de seguridad para ayudarte a encontrar oportunidades seguras.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Es seguro el yield farming en DeFi?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'El yield farming en DeFi conlleva riesgos como vulnerabilidades de contratos inteligentes, fallos de oráculos y volatilidad del mercado. Yiield proporciona puntuaciones de seguridad (0-100) basadas en auditorías, antigüedad del protocolo, TVL e historial de exploits. Recomendamos protocolos con puntuaciones superiores a 70 para inversiones más seguras.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quali sono i migliori rendimenti di stablecoin in DeFi?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'I migliori rendimenti di stablecoin variano in base al protocollo e alle condizioni di mercato. I principali protocolli come Aave, Compound, Morpho e Spark offrono tipicamente tassi competitivi tra il 3-15% APY. Yiield confronta tutti i principali protocolli con punteggi di sicurezza per aiutarti a trovare opportunità sicure.',
      },
    },
    {
      '@type': 'Question',
      name: 'Il yield farming DeFi è sicuro?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Il yield farming DeFi comporta rischi tra cui vulnerabilità degli smart contract, errori degli oracle e volatilità del mercato. Yiield fornisce punteggi di sicurezza (0-100) basati su audit, età del protocollo, TVL e cronologia degli exploit. Consigliamo protocolli con punteggi superiori a 70 per investimenti più sicuri.',
      },
    },
  ],
};

// Schema BreadcrumbList
const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://yiield.xyz',
    },
  ],
};

// Schema FinancialProduct pour les yields
const financialProductSchema = {
  '@context': 'https://schema.org',
  '@type': 'FinancialProduct',
  '@id': 'https://yiield.xyz/#yields',
  name: 'DeFi Stablecoin Yields Comparison',
  description: 'Compare and find the best stablecoin yields across decentralized finance protocols',
  provider: {
    '@type': 'Organization',
    name: 'Yiield',
  },
  category: 'Cryptocurrency Investment',
  feesAndCommissionsSpecification: 'Free to use. Protocol fees may apply when investing.',
};

// ============================================
// ROOT LAYOUT
// ============================================

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Google Analytics GA4 */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-YYPH87DSSG" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-YYPH87DSSG');
            `,
          }}
        />
        {/* End Google Analytics */}

        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PNMXQNBR');`,
          }}
        />
        {/* End Google Tag Manager */}

        {/* Preconnect pour performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://yields.llama.fi" />
        <link rel="preconnect" href="https://assets.coingecko.com" />
        <link rel="preconnect" href="https://icons.llama.fi" />

        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://yields.llama.fi" />
        <link rel="dns-prefetch" href="https://assets.coingecko.com" />
        
        {/* Schema.org JSON-LD pour SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(financialProductSchema) }}
        />
      </head>
      <body className="min-h-screen bg-dark-950 text-white antialiased">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PNMXQNBR"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        {/* Grain overlay for texture */}
        <div className="grain-overlay" />
        
        {/* Main content */}
        <div className="relative z-10">
          {children}
        </div>
        
        {/* Noscript fallback */}
        <noscript>
          <div style={{ padding: '20px', textAlign: 'center', background: '#1e293b', color: 'white' }}>
            Please enable JavaScript to use Yiield - DeFi Yield Comparison Tool
          </div>
        </noscript>
      </body>
    </html>
  );
}
