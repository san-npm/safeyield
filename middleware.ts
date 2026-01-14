import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './src/i18n/config';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
});

export const config = {
  matcher: ['/', '/(en|fr|es|it|de)/:path*', '/((?!_next|_vercel|.*\\..*).*)'],
};
