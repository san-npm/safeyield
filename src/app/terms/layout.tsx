import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for Yiield DeFi yield comparison platform. Read our terms and conditions for using the service.',
  openGraph: {
    title: 'Terms of Service - Yiield',
    description: 'Terms of Service for Yiield DeFi yield comparison platform.',
    url: 'https://app.yiield.xyz/terms',
    images: ['https://app.yiield.xyz/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service - Yiield',
    description: 'Terms of Service for Yiield DeFi yield comparison platform.',
    images: ['https://app.yiield.xyz/og-image.png'],
  },
  alternates: {
    canonical: 'https://app.yiield.xyz/terms',
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
