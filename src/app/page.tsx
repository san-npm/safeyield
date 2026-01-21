'use client';

import { useMemo, useState } from 'react';
import { Footer, TopPools, PoolsTable, Filters, Stats } from '@/components';
import { usePools, useStats } from '@/hooks/usePools';
import { Shield, TrendingUp, Clock, CheckCircle, RefreshCw, Menu, X, Globe } from 'lucide-react';
import { useI18n, I18nProvider, locales, localeFlags, localeNames, Locale } from '@/utils/i18n';

// ============================================
// LOGO YIIELD
// ============================================

function YiieldLogo() {
  return (
    <div className="flex items-center h-8">
      <span className="text-2xl font-bold text-white leading-none">y</span>
      <div className="flex items-end gap-[3px] h-[22px] mx-[2px] mb-[1px]">
        <div className="w-[5px] h-[13px] bg-red-500 rounded-[2px]" />
        <div className="w-[5px] h-[19px] bg-safe-400 rounded-[2px]" />
      </div>
      <span className="text-2xl font-bold text-white leading-none">eld</span>
    </div>
  );
}

// ============================================
// SÉLECTEUR DE LANGUE
// ============================================

function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { locale, setLocale } = useI18n();
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm text-white/70"
      >
        <Globe className="w-4 h-4" />
        <span>{localeFlags[locale]} {locale.toUpperCase()}</span>
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 bg-dark-900 border border-white/10 rounded-xl overflow-hidden min-w-[160px] shadow-xl">
            {locales.map(lang => (
              <button
                key={lang}
                onClick={() => { setLocale(lang); setIsOpen(false); }}
                className={`w-full px-4 py-3 text-left text-sm flex items-center gap-3 hover:bg-white/5 transition-colors
                           ${lang === locale ? 'bg-safe-500/10 text-safe-400' : 'text-white/70'}`}
              >
                <span>{localeFlags[lang]}</span>
                <span>{localeNames[lang]}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ============================================
// HEADER
// ============================================

function Header({ lastUpdated, onRefresh, isLoading }: { lastUpdated: Date | null; onRefresh: () => void; isLoading: boolean }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-dark-950/80 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <YiieldLogo />

          <nav className="hidden md:flex items-center gap-8">
            <a href="#top-pools" className="text-sm text-white/60 hover:text-white transition-colors">{t('nav.topYields')}</a>
            <a href="#all-pools" className="text-sm text-white/60 hover:text-white transition-colors">{t('nav.allPools')}</a>
            <a href="#security" className="text-sm text-white/60 hover:text-white transition-colors">{t('nav.security')}</a>
            <a href="/analytics" className="text-sm text-white/60 hover:text-white transition-colors">Analytics</a>
            <a href="/faq" className="text-sm text-white/60 hover:text-white transition-colors">{t('nav.faq')}</a>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block"><LanguageSelector /></div>
            {lastUpdated && (
              <div className="hidden lg:flex items-center gap-2 text-xs text-white/40">
                <Clock className="w-3 h-3" />
                <span>{t('common.updated')} {lastUpdated.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            )}
            <button onClick={onRefresh} disabled={isLoading} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50">
              <RefreshCw className={`w-4 h-4 text-white/70 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 rounded-lg bg-white/5">
              {isMobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/5 bg-dark-950/95 backdrop-blur-xl">
          <nav className="px-4 py-4 space-y-2">
            <div className="px-4 py-2 mb-2"><LanguageSelector /></div>
            <a href="#top-pools" className="block px-4 py-2 rounded-lg text-white/70 hover:bg-white/5" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.topYields')}</a>
            <a href="#all-pools" className="block px-4 py-2 rounded-lg text-white/70 hover:bg-white/5" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.allPools')}</a>
            <a href="#security" className="block px-4 py-2 rounded-lg text-white/70 hover:bg-white/5" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.security')}</a>
            <a href="/analytics" className="block px-4 py-2 rounded-lg text-white/70 hover:bg-white/5" onClick={() => setIsMobileMenuOpen(false)}>Analytics</a>
            <a href="/faq" className="block px-4 py-2 rounded-lg text-white/70 hover:bg-white/5" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.faq')}</a>
          </nav>
        </div>
      )}
    </header>
  );
}

// ============================================
// CONTENU PRINCIPAL
// ============================================

function HomeContent() {
  const { pools, topPools, filteredPools, isLoading, error, lastUpdated, filters, setFilters, refresh } = usePools();
  const stats = useStats(filteredPools);
  const { locale, t } = useI18n();
  
  const availableChains = useMemo(() => [...new Set(pools.map(p => p.chain))], [pools]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header lastUpdated={lastUpdated} onRefresh={refresh} isLoading={isLoading} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-safe-500/5 via-transparent to-transparent" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {t('hero.title1')} <span className="text-gradient">{t('hero.title2')}</span>
                <br />
                {t('hero.title3')} <span className="text-gradient">{t('hero.title4')}</span>
              </h1>
              <p className="text-lg text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">{t('hero.subtitle')}</p>
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-white/50"><Shield className="w-4 h-4 text-safe-400" /><span>{t('nav.security')}</span></div>
                <div className="flex items-center gap-2 text-white/50"><TrendingUp className="w-4 h-4 text-safe-400" /><span>APY</span></div>
                <div className="flex items-center gap-2 text-white/50"><Clock className="w-4 h-4 text-safe-400" /><span>{t('common.realtime')}</span></div>
                <div className="flex items-center gap-2 text-white/50"><CheckCircle className="w-4 h-4 text-safe-400" /><span>{t('common.audited')}</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {error && (
            <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
              <p>Error: {error}</p>
              <button onClick={refresh} className="mt-2 text-sm underline hover:no-underline">Retry</button>
            </div>
          )}

          {/* Info Box - Mise à jour des données */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-500/5 border border-blue-500/20">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-white/70">{t('info.dataUpdateText')}</span>
            </div>
          </div>

          <Stats {...stats} />
          <section id="top-pools"><TopPools pools={topPools} locale={locale} /></section>
          <Filters filters={filters} onFilterChange={setFilters} availableChains={availableChains} locale={locale} />
          <section id="all-pools"><PoolsTable pools={filteredPools} isLoading={isLoading} locale={locale} /></section>

          {/* Security Section */}
          <section id="security" className="mt-16">
            <div className="card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-safe-500/10"><Shield className="w-6 h-6 text-safe-400" /></div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{t('security.title')}</h2>
                  <p className="text-white/50">{t('security.subtitle')}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-4 rounded-xl bg-white/5">
                  <div className="text-3xl font-bold text-safe-400 mb-2">25pts</div>
                  <h3 className="font-semibold text-white mb-1">{t('security.auditsTitle')}</h3>
                  <p className="text-sm text-white/50">{t('security.auditsDesc')}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5">
                  <div className="text-3xl font-bold text-safe-400 mb-2">25pts</div>
                  <h3 className="font-semibold text-white mb-1">{t('security.ageTitle')}</h3>
                  <p className="text-sm text-white/50">{t('security.ageDesc')}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5">
                  <div className="text-3xl font-bold text-safe-400 mb-2">25pts</div>
                  <h3 className="font-semibold text-white mb-1">{t('security.tvlTitle')}</h3>
                  <p className="text-sm text-white/50">{t('security.tvlDesc')}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5">
                  <div className="text-3xl font-bold text-safe-400 mb-2">25pts</div>
                  <h3 className="font-semibold text-white mb-1">{t('security.historyTitle')}</h3>
                  <p className="text-sm text-white/50">{t('security.historyDesc')}</p>
                </div>
              </div>

              <div className="mt-8 p-4 rounded-xl bg-safe-500/5 border border-safe-500/20">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-safe-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">{t('security.recommendation')}</h4>
                    <p className="text-sm text-white/60">{t('security.recommendationText')}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer locale={locale} />
    </div>
  );
}

// ============================================
// PAGE PRINCIPALE
// ============================================

export default function HomePage() {
  return (
    <I18nProvider>
      <HomeContent />
    </I18nProvider>
  );
}
