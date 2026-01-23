'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Footer } from '@/components';
import { useI18n, I18nProvider, locales, localeFlags, localeNames } from '@/utils/i18n';
import { Globe, ArrowLeft, Shield, Mail } from 'lucide-react';

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
// LANGUAGE SELECTOR
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

function Header() {
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-dark-950/80 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">{t('nav.topYields')}</span>
            </Link>
            <div className="h-6 w-px bg-white/10" />
            <YiieldLogo />
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/#top-pools" className="text-sm text-white/60 hover:text-white transition-colors">{t('nav.topYields')}</Link>
            <Link href="/#all-pools" className="text-sm text-white/60 hover:text-white transition-colors">{t('nav.allPools')}</Link>
            <Link href="/analytics" className="text-sm text-white/60 hover:text-white transition-colors">Analytics</Link>
            <Link href="/faq" className="text-sm text-white/60 hover:text-white transition-colors">{t('nav.faq')}</Link>
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSelector />
          </div>
        </div>
      </div>
    </header>
  );
}

// ============================================
// MAIN CONTENT
// ============================================

function AboutPageContent() {
  const { t } = useI18n();

  const supportedChains = [
    'Ethereum', 'Arbitrum', 'Optimism', 'Base', 'Polygon', 'BNB Chain',
    'Avalanche', 'Solana', 'Gnosis', 'Linea', 'Hyperliquid', 'Plasma'
  ];

  return (
    <div className="min-h-screen flex flex-col bg-dark-950">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-safe-500/5 via-transparent to-transparent" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              About <span className="text-gradient">Yiield</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/60 leading-relaxed max-w-3xl">
              The free platform that helps you find <strong className="text-white">safe</strong> and{' '}
              <strong className="text-white">high-yielding</strong> stablecoin opportunities across DeFi.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 px-4 border-t border-white/5">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-safe-400">Our Mission</h2>
            <div className="space-y-6 text-lg text-white/60 leading-relaxed">
              <p>
                DeFi offers incredible yield opportunities, but navigating the landscape safely is challenging.
                With hundreds of protocols, varying security standards, and constantly changing APY rates,
                users often struggle to find yields that balance returns with safety.
              </p>
              <p>
                <strong className="text-white">Yiield was built to solve this problem.</strong> We aggregate
                stablecoin yield data from over 20 protocols and apply a unique security scoring system —
                the <span className="text-safe-400">Yiield Score</span> — that helps users evaluate
                protocol safety alongside APY rates.
              </p>
              <p>
                Our goal is simple: <strong className="text-white">make DeFi yields accessible and safe for everyone</strong>,
                from first-time users to experienced treasury managers.
              </p>
            </div>
          </div>
        </section>

        {/* Yiield Score Methodology */}
        <section className="py-16 px-4 bg-white/[0.02]">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-safe-400">The Yiield Score</h2>
            <p className="text-lg text-white/60 mb-10">
              Our proprietary security rating evaluates DeFi protocols on a scale of <strong className="text-white">0-100</strong>.
              Higher scores indicate safer protocols for stablecoin deposits.
            </p>

            <div className="grid gap-6">
              {/* Audit Quality */}
              <div className="card p-6 md:p-8 hover:border-safe-500/30 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-safe-500/20 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-safe-400" />
                    </span>
                    Audit Quality
                  </h3>
                  <span className="text-2xl font-bold text-safe-400">30%</span>
                </div>
                <p className="text-white/60 mb-4">
                  We evaluate the quality and comprehensiveness of security audits performed on the protocol&apos;s smart contracts.
                </p>
                <div className="grid md:grid-cols-3 gap-3 text-sm">
                  <div className="bg-green-500/20 rounded-lg p-3 border border-green-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-green-400">Tier 1</span>
                      <span className="text-xs text-green-400/60">+10 pts</span>
                    </div>
                    <p className="text-white/60 text-xs leading-relaxed">Trail of Bits, OpenZeppelin, Consensys Diligence, Spearbit, ChainSecurity, Sigma Prime</p>
                  </div>
                  <div className="bg-blue-500/20 rounded-lg p-3 border border-blue-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-blue-400">Tier 2</span>
                      <span className="text-xs text-blue-400/60">+6 pts</span>
                    </div>
                    <p className="text-white/60 text-xs leading-relaxed">Certik, PeckShield, Halborn, Quantstamp, OtterSec, Zellic, Nethermind, Cantina, Certora, MixBytes</p>
                  </div>
                  <div className="bg-purple-500/20 rounded-lg p-3 border border-purple-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-purple-400">Tier 3</span>
                      <span className="text-xs text-purple-400/60">+3 pts</span>
                    </div>
                    <p className="text-white/60 text-xs leading-relaxed">Sherlock, Code4rena, Hacken, Hexens, Omniscia, and other recognized firms</p>
                  </div>
                </div>
              </div>

              {/* Team Transparency */}
              <div className="card p-6 md:p-8 hover:border-safe-500/30 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-safe-500/20 flex items-center justify-center text-safe-400">
                      <span className="text-lg">👥</span>
                    </span>
                    Team Transparency
                  </h3>
                  <span className="text-2xl font-bold text-safe-400">25%</span>
                </div>
                <p className="text-white/60">
                  We assess whether the team is publicly known, has verifiable professional history,
                  maintains active communication channels, and provides regular development updates.
                  Protocols with doxxed teams and strong track records score higher.
                </p>
              </div>

              {/* Protocol Maturity */}
              <div className="card p-6 md:p-8 hover:border-safe-500/30 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-safe-500/20 flex items-center justify-center text-safe-400">
                      <span className="text-lg">⏱️</span>
                    </span>
                    Protocol Maturity
                  </h3>
                  <span className="text-2xl font-bold text-safe-400">20%</span>
                </div>
                <p className="text-white/60">
                  We evaluate time since mainnet launch, Total Value Locked (TVL) stability over time,
                  historical security incidents, recovery from past incidents, and code upgrade frequency.
                  Battle-tested protocols with stable TVL score higher.
                </p>
              </div>

              {/* Governance */}
              <div className="card p-6 md:p-8 hover:border-safe-500/30 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-safe-500/20 flex items-center justify-center text-safe-400">
                      <span className="text-lg">🏛️</span>
                    </span>
                    Governance
                  </h3>
                  <span className="text-2xl font-bold text-safe-400">15%</span>
                </div>
                <p className="text-white/60">
                  We look at timelock mechanisms on admin functions (24h+ preferred), multisig requirements
                  (3/5+ preferred), active DAO governance, transparent proposal processes, and emergency
                  pause mechanisms.
                </p>
              </div>

              {/* Insurance */}
              <div className="card p-6 md:p-8 hover:border-safe-500/30 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-safe-500/20 flex items-center justify-center text-safe-400">
                      <span className="text-lg">🛡️</span>
                    </span>
                    Insurance &amp; Coverage
                  </h3>
                  <span className="text-2xl font-bold text-safe-400">10%</span>
                </div>
                <p className="text-white/60">
                  We consider Nexus Mutual coverage availability, InsurAce policies, protocol-native
                  insurance funds, and bug bounty programs (such as those on Immunefi).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Supported Protocols */}
        <section className="py-16 px-4 border-t border-white/5">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-safe-400">Supported Protocols</h2>
            <p className="text-lg text-white/60 mb-10">
              Yiield tracks stablecoin yields from <strong className="text-white">20+ carefully selected</strong> DeFi
              protocols across multiple blockchains.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  Lending Protocols
                </h3>
                <ul className="space-y-2 text-white/60">
                  {['Aave (V2, V3)', 'Compound (V2, V3)', 'Morpho (V1, Blue)', 'Spark Protocol', 'Euler (V1, V2)', 'Fluid', 'Venus Protocol', 'Benqi'].map((protocol) => (
                    <li key={protocol} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-safe-400" />
                      {protocol}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                  Yield &amp; Vaults
                </h3>
                <ul className="space-y-2 text-white/60">
                  {[
                    { name: 'Sky (MakerDAO)', verified: false },
                    { name: 'Curve Finance', verified: false },
                    { name: 'Convex Finance', verified: false },
                    { name: 'Yearn Finance', verified: false },
                    { name: 'Lagoon Finance', verified: true },
                    { name: 'Cap Money', verified: true },
                    { name: 'Wildcat Protocol', verified: true },
                  ].map((protocol) => (
                    <li key={protocol.name} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-safe-400" />
                      {protocol.name}
                      {protocol.verified && (
                        <span className="text-xs px-1.5 py-0.5 bg-safe-500/20 text-safe-400 rounded">
                          ✓ Verified
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Supported Chains */}
        <section className="py-16 px-4 bg-white/[0.02]">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-safe-400">Supported Blockchains</h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {supportedChains.map((chain) => (
                <div
                  key={chain}
                  className="card p-4 text-center hover:border-safe-500/30 transition-colors"
                >
                  <span className="text-white font-medium">{chain}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stablecoins */}
        <section className="py-16 px-4 border-t border-white/5">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-safe-400">Supported Stablecoins</h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">USD Stablecoins</h3>
                <div className="flex flex-wrap gap-2">
                  {['USDC', 'USDT', 'DAI', 'USDS', 'FRAX', 'LUSD', 'GHO', 'GUSD', 'PYUSD', 'crvUSD'].map((coin) => (
                    <span
                      key={coin}
                      className="px-4 py-2 bg-blue-500/10 text-blue-300 rounded-full text-sm font-medium border border-blue-500/20"
                    >
                      {coin}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">EUR Stablecoins</h3>
                <div className="flex flex-wrap gap-2">
                  {['EURe', 'EURS', 'agEUR', 'EURT'].map((coin) => (
                    <span
                      key={coin}
                      className="px-4 py-2 bg-purple-500/10 text-purple-300 rounded-full text-sm font-medium border border-purple-500/20"
                    >
                      {coin}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">Gold-Backed Tokens</h3>
                <div className="flex flex-wrap gap-2">
                  {['XAUT', 'PAXG'].map((coin) => (
                    <span
                      key={coin}
                      className="px-4 py-2 bg-yellow-500/10 text-yellow-300 rounded-full text-sm font-medium border border-yellow-500/20"
                    >
                      {coin}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Data Sources */}
        <section className="py-16 px-4 bg-white/[0.02]">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-safe-400">Data &amp; Transparency</h2>

            <div className="space-y-6 text-lg text-white/60 leading-relaxed">
              <p>
                Yiield aggregates yield data primarily from <strong className="text-white">DefiLlama&apos;s API</strong>,
                the industry standard for DeFi analytics. Our data is updated <strong className="text-white">every 15 minutes</strong> to
                ensure accuracy.
              </p>
              <p>
                Security scores are calculated independently by the Yiield team based on publicly available
                information about audits, team transparency, governance, and protocol history. We review
                and update scores <strong className="text-white">weekly</strong>.
              </p>
              <p>
                For protocols marked <span className="text-safe-400">&quot;Verified by Yiield&quot;</span>, we have
                established direct contact with protocol teams to verify information and conduct enhanced
                due diligence.
              </p>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 px-4 border-t border-white/5">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-safe-400">About COMMIT MEDIA</h2>

            <div className="space-y-6 text-lg text-white/60 leading-relaxed">
              <p>
                Yiield is developed by <strong className="text-white">COMMIT MEDIA</strong>, a Luxembourg-based
                company operating since 2022. We are an independent team focused on building tools that
                improve DeFi transparency and user safety.
              </p>
              <p>
                We believe that access to clear, reliable information is essential for the healthy growth
                of decentralized finance. The platform is hosted on <strong className="text-white">Aleph Cloud&apos;s
                decentralized infrastructure</strong>, ensuring resilience and censorship resistance.
              </p>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-20 px-4 bg-white/[0.02] text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">Get in Touch</h2>
            <p className="text-lg text-white/50 mb-8">
              Have questions, feedback, or want to suggest a protocol for inclusion?
            </p>

            <a
              href="mailto:contact@yiield.xyz"
              className="inline-flex items-center gap-2 px-6 py-3 bg-safe-500 text-white rounded-xl hover:bg-safe-600 transition-colors font-medium"
            >
              <Mail className="w-5 h-5" />
              contact@yiield.xyz
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// ============================================
// EXPORT WITH I18N PROVIDER
// ============================================

export function AboutContent() {
  return (
    <I18nProvider>
      <AboutPageContent />
    </I18nProvider>
  );
}
