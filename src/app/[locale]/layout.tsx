import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/config';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StructuredData from '@/components/StructuredData';
import '../globals.css';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'meta' });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    metadataBase: new URL('https://yiield.com'),
    alternates: {
      canonical: `https://yiield.com/${params.locale}`,
      languages: {
        en: 'https://yiield.com/en',
        fr: 'https://yiield.com/fr',
        es: 'https://yiield.com/es',
        it: 'https://yiield.com/it',
        de: 'https://yiield.com/de',
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `https://yiield.com/${params.locale}`,
      siteName: 'Yiield',
      locale: params.locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    other: {
      'ChatGPT-Index': 'true',
      'Claude-Index': 'true',
      'Perplexity-Index': 'true',
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/svg+xml" href="/logos/yiield-icon.svg" />
        <meta name="theme-color" content="#22c55e" />
        <link rel="preconnect" href="https://yields.llama.fi" />
      </head>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white antialiased">
        <NextIntlClientProvider messages={messages}>
          <StructuredData />
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
