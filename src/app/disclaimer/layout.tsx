import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disclaimer - Risk Information',
  description: 'Important disclaimer and risk information for using Yiield DeFi yield comparison platform. Understand the risks associated with DeFi investments.',
  openGraph: {
    title: 'Disclaimer - Yiield DeFi Yield Comparison',
    description: 'Important disclaimer and risk information for using Yiield.',
    url: 'https://app.yiield.xyz/disclaimer',
    images: ['https://app.yiield.xyz/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Disclaimer - Yiield DeFi Yield Comparison',
    description: 'Important disclaimer and risk information for using Yiield.',
    images: ['https://app.yiield.xyz/og-image.png'],
  },
  alternates: {
    canonical: 'https://app.yiield.xyz/disclaimer',
  },
};

export default function DisclaimerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
