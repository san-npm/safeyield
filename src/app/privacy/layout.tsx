import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Yiield DeFi yield comparison platform. Learn how we handle your data and protect your privacy.',
  openGraph: {
    title: 'Privacy Policy - Yiield',
    description: 'Privacy Policy for Yiield DeFi yield comparison platform.',
    url: 'https://app.yiield.xyz/privacy',
    images: ['https://app.yiield.xyz/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy - Yiield',
    description: 'Privacy Policy for Yiield DeFi yield comparison platform.',
    images: ['https://app.yiield.xyz/og-image.png'],
  },
  alternates: {
    canonical: 'https://app.yiield.xyz/privacy',
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
