'use client';

import { useTranslations } from 'next-intl';
import YiieldLogo from './YiieldLogo';

export default function Footer() {
  const t = useTranslations('footer');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-1">
            <YiieldLogo size={100} className="text-gray-900 dark:text-white mb-4" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('description')}
            </p>
          </div>

          <div className="col-span-1 md:col-span-2">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                ⚠️ {t('disclaimer')}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>© {currentYear} Yiield. {t('rights')}</p>
        </div>
      </div>
    </footer>
  );
}
