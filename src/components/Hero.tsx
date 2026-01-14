'use client';

import { useTranslations } from 'next-intl';
import { TrendingUp, Shield, Zap } from 'lucide-react';

export default function Hero() {
  const t = useTranslations('hero');

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-6">
            <Zap size={16} className="text-primary-600 dark:text-primary-400" />
            <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">
              Live Data • Updated Hourly
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {t('title')}
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            {t('description')}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
              <TrendingUp className="text-green-500" size={20} />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Real-time APY
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
              <Shield className="text-blue-500" size={20} />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Security Scores
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-200 dark:bg-primary-900/20 rounded-full filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-200 dark:bg-blue-900/20 rounded-full filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
}
