'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';
import { useState } from 'react';
import YiieldLogo from './YiieldLogo';
import { locales, localeNames, type Locale } from '@/i18n/config';

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const switchLocale = (newLocale: string) => {
    const currentPath = pathname.replace(`/${locale}`, '');
    router.push(`/${newLocale}${currentPath}`);
    setShowLangMenu(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <a href={`/${locale}`} className="flex items-center gap-2">
              <YiieldLogo size={100} className="text-gray-900 dark:text-white" />
            </a>
          </div>

          <nav className="flex items-center gap-6">
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label={t('language')}
              >
                <Globe size={18} />
                <span className="text-sm font-medium">{localeNames[locale]}</span>
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2">
                  {locales.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => switchLocale(loc)}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                        loc === locale ? 'bg-gray-50 dark:bg-gray-750 font-semibold' : ''
                      }`}
                    >
                      {localeNames[loc]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
