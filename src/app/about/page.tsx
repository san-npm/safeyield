// src/app/about/page.tsx
// Static About page with rich SEO content - uses same design as main page

import type { Metadata } from 'next';
import { AboutContent } from './AboutContent';

export const metadata: Metadata = {
  title: 'About Yiield — Mission, Methodology & Security Scoring',
  description: 'Learn about Yiield, the stablecoin yield comparison platform. Discover our Yiield Score methodology, supported protocols, data sources, and mission to make DeFi safer.',
  keywords: [
    'about Yiield',
    'Yiield methodology',
    'Yiield Score explained',
    'DeFi security scoring',
    'stablecoin yield platform',
    'how Yiield works',
    'DeFi safety rating',
    'stablecoin APY comparison methodology',
  ],
  openGraph: {
    title: 'About Yiield — Mission, Methodology & Security Scoring',
    description: 'Learn how Yiield helps you find safe stablecoin yields with our unique security scoring system.',
    url: 'https://app.yiield.xyz/about',
    type: 'website',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Yiield — How We Score DeFi Safety',
    description: 'Discover our methodology for rating DeFi protocol security.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://app.yiield.xyz/about',
  },
};

// JSON-LD Schema for the organization
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Yiield',
  url: 'https://yiield.xyz',
  logo: 'https://app.yiield.xyz/logo.png',
  description: 'DeFi stablecoin yield comparison platform with security scoring',
  founder: {
    '@type': 'Organization',
    name: 'COMMIT MEDIA',
  },
  foundingDate: '2022',
  sameAs: [
    'https://twitter.com/yiield_xyz',
  ],
};

// FAQ Schema for rich snippets
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Yiield?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yiield is a free DeFi platform that helps users find the safest and highest-yielding stablecoin opportunities. Unlike other yield aggregators, Yiield includes a proprietary security scoring system (Yiield Score) to help users evaluate protocol safety alongside APY rates.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the Yiield Score?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Yiield Score is a security rating from 0-100 that evaluates DeFi protocols based on audit quality (30%), team transparency (25%), protocol maturity (20%), governance (15%), and insurance coverage (10%). Higher scores indicate safer protocols.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Yiield free to use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Yiield is completely free for all users.',
      },
    },
    {
      '@type': 'Question',
      name: 'How often is yield data updated?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yield data is refreshed every 15 minutes from our data sources. Security scores are reviewed and updated weekly by the Yiield team.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does Verified by Yiield mean?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Protocols with the "Verified by Yiield" badge have been directly verified through contact with protocol founders and enhanced due diligence, providing an additional layer of trust beyond our standard security scoring.',
      },
    },
  ],
};

export default function AboutPage() {
  return (
    <>
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <AboutContent />
    </>
  );
}
