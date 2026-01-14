import { useLocale, useTranslations } from 'next-intl';

export default function StructuredData() {
  const locale = useLocale();
  const t = useTranslations('meta');

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Yiield',
    alternateName: 'Yiield - Best Stablecoin Yields',
    url: `https://yiield.com/${locale}`,
    description: t('description'),
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250',
    },
    keywords: t('keywords'),
    inLanguage: [locale, 'en', 'fr', 'es', 'it', 'de'],
    potentialAction: {
      '@type': 'SearchAction',
      target: `https://yiield.com/${locale}?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
