import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ - Frequently Asked Questions',
  description: 'Find answers to common questions about Yiield, DeFi yields, stablecoins, security scores, and how to safely earn interest on your crypto.',
  openGraph: {
    title: 'FAQ - Yiield DeFi Yield Comparison',
    description: 'Find answers to common questions about Yiield, DeFi yields, stablecoins, and security scores.',
    url: 'https://app.yiield.xyz/faq',
    images: ['https://app.yiield.xyz/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAQ - Yiield DeFi Yield Comparison',
    description: 'Find answers to common questions about Yiield, DeFi yields, stablecoins, and security scores.',
    images: ['https://app.yiield.xyz/og-image.png'],
  },
  alternates: {
    canonical: 'https://app.yiield.xyz/faq',
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
