// src/app/about/page.tsx
// Static About page with rich SEO content

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Yiield — Mission, Methodology & Security Scoring',
  description: 'Learn about Yiield, the stablecoin yield comparison platform. Discover our Yiield Score methodology, supported protocols, data sources, and mission to make DeFi safer.',
  keywords: [
    'about Yiield',
    'Yiield methodology',
    'Yiield Score explained',
    'DeFi security scoring',
    'stablecoin yield platform',
    'how Yiield works',
    'DeFi safety rating',
    'stablecoin APY comparison methodology',
  ],
  openGraph: {
    title: 'About Yiield — Mission, Methodology & Security Scoring',
    description: 'Learn how Yiield helps you find safe stablecoin yields with our unique security scoring system.',
    url: 'https://app.yiield.xyz/about',
    type: 'website',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Yiield — How We Score DeFi Safety',
    description: 'Discover our methodology for rating DeFi protocol security.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://app.yiield.xyz/about',
  },
};

// JSON-LD Schema for the organization
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Yiield',
  url: 'https://yiield.xyz',
  logo: 'https://app.yiield.xyz/logo.png',
  description: 'DeFi stablecoin yield comparison platform with security scoring',
  founder: {
    '@type': 'Organization',
    name: 'COMMIT MEDIA',
  },
  foundingDate: '2025',
  sameAs: [
    'https://twitter.com/yiield_xyz',
  ],
};

// FAQ Schema for rich snippets
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Yiield?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yiield is a free DeFi platform that helps users find the safest and highest-yielding stablecoin opportunities. Unlike other yield aggregators, Yiield includes a proprietary security scoring system (Yiield Score) to help users evaluate protocol safety alongside APY rates.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the Yiield Score?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Yiield Score is a security rating from 0-100 that evaluates DeFi protocols based on audit quality (30%), team transparency (25%), protocol maturity (20%), governance (15%), and insurance coverage (10%). Higher scores indicate safer protocols.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Yiield free to use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Yiield is completely free for all users. We also offer a free public API for developers to access stablecoin yield data with security scores.',
      },
    },
    {
      '@type': 'Question',
      name: 'How often is yield data updated?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yield data is refreshed every 15 minutes from our data sources. Security scores are reviewed and updated weekly by the Yiield team.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does Verified by Yiield mean?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Protocols with the "Verified by Yiield" badge have been directly verified through contact with protocol founders and enhanced due diligence, providing an additional layer of trust beyond our standard security scoring.',
      },
    },
  ],
};

export default function AboutPage() {
  return (
    <>
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="min-h-screen bg-[#0f172a] text-slate-100">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent" />
          <div className="max-w-4xl mx-auto relative z-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors mb-8 group"
            >
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to App
            </Link>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              About <span className="text-emerald-400">Yiield</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 leading-relaxed max-w-3xl">
              The free platform that helps you find <strong className="text-white">safe</strong> and{' '}
              <strong className="text-white">high-yielding</strong> stablecoin opportunities across DeFi.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 px-4 border-t border-slate-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-emerald-400">Our Mission</h2>
            <div className="space-y-6 text-lg text-slate-300 leading-relaxed">
              <p>
                DeFi offers incredible yield opportunities, but navigating the landscape safely is challenging.
                With hundreds of protocols, varying security standards, and constantly changing APY rates,
                users often struggle to find yields that balance returns with safety.
              </p>
              <p>
                <strong className="text-white">Yiield was built to solve this problem.</strong> We aggregate
                stablecoin yield data from over 20 protocols and apply a unique security scoring system —
                the <span className="text-emerald-400">Yiield Score</span> — that helps users evaluate
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
        <section className="py-16 px-4 bg-slate-900/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-emerald-400">The Yiield Score</h2>
            <p className="text-lg text-slate-300 mb-10">
              Our proprietary security rating evaluates DeFi protocols on a scale of <strong className="text-white">0-100</strong>.
              Higher scores indicate safer protocols for stablecoin deposits.
            </p>

            <div className="grid gap-6">
              {/* Audit Quality */}
              <div className="bg-slate-800/50 rounded-2xl p-6 md:p-8 border border-slate-700 hover:border-emerald-500/30 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                      🔒
                    </span>
                    Audit Quality
                  </h3>
                  <span className="text-2xl font-bold text-emerald-400">30%</span>
                </div>
                <p className="text-slate-300 mb-4">
                  We evaluate the quality and comprehensiveness of security audits performed on the protocol&apos;s smart contracts.
                </p>
                <div className="grid md:grid-cols-3 gap-3 text-sm">
                  <div className="bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/20">
                    <span className="font-semibold text-emerald-400">Tier 1</span>
                    <p className="text-slate-400 mt-1">Trail of Bits, OpenZeppelin, Consensys, Spearbit</p>
                  </div>
                  <div className="bg-yellow-500/10 rounded-lg p-3 border border-yellow-500/20">
                    <span className="font-semibold text-yellow-400">Tier 2</span>
                    <p className="text-slate-400 mt-1">Certik, Quantstamp, Halborn, Peckshield</p>
                  </div>
                  <div className="bg-orange-500/10 rounded-lg p-3 border border-orange-500/20">
                    <span className="font-semibold text-orange-400">Tier 3</span>
                    <p className="text-slate-400 mt-1">Other recognized security firms</p>
                  </div>
                </div>
              </div>

              {/* Team Transparency */}
              <div className="bg-slate-800/50 rounded-2xl p-6 md:p-8 border border-slate-700 hover:border-emerald-500/30 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                      👥
                    </span>
                    Team Transparency
                  </h3>
                  <span className="text-2xl font-bold text-emerald-400">25%</span>
                </div>
                <p className="text-slate-300">
                  We assess whether the team is publicly known, has verifiable professional history,
                  maintains active communication channels, and provides regular development updates.
                  Protocols with doxxed teams and strong track records score higher.
                </p>
              </div>

              {/* Protocol Maturity */}
              <div className="bg-slate-800/50 rounded-2xl p-6 md:p-8 border border-slate-700 hover:border-emerald-500/30 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                      ⏱️
                    </span>
                    Protocol Maturity
                  </h3>
                  <span className="text-2xl font-bold text-emerald-400">20%</span>
                </div>
                <p className="text-slate-300">
                  We evaluate time since mainnet launch, Total Value Locked (TVL) stability over time,
                  historical security incidents, recovery from past incidents, and code upgrade frequency.
                  Battle-tested protocols with stable TVL score higher.
                </p>
              </div>

              {/* Governance */}
              <div className="bg-slate-800/50 rounded-2xl p-6 md:p-8 border border-slate-700 hover:border-emerald-500/30 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                      🏛️
                    </span>
                    Governance
                  </h3>
                  <span className="text-2xl font-bold text-emerald-400">15%</span>
                </div>
                <p className="text-slate-300">
                  We look at timelock mechanisms on admin functions (24h+ preferred), multisig requirements
                  (3/5+ preferred), active DAO governance, transparent proposal processes, and emergency
                  pause mechanisms.
                </p>
              </div>

              {/* Insurance */}
              <div className="bg-slate-800/50 rounded-2xl p-6 md:p-8 border border-slate-700 hover:border-emerald-500/30 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                      🛡️
                    </span>
                    Insurance &amp; Coverage
                  </h3>
                  <span className="text-2xl font-bold text-emerald-400">10%</span>
                </div>
                <p className="text-slate-300">
                  We consider Nexus Mutual coverage availability, InsurAce policies, protocol-native
                  insurance funds, and bug bounty programs (such as those on Immunefi).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Supported Protocols */}
        <section className="py-16 px-4 border-t border-slate-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-emerald-400">Supported Protocols</h2>
            <p className="text-lg text-slate-300 mb-10">
              Yiield tracks stablecoin yields from <strong className="text-white">20+ carefully selected</strong> DeFi
              protocols across multiple blockchains.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold mb-4 text-slate-200 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  Lending Protocols
                </h3>
                <ul className="space-y-2 text-slate-300">
                  {['Aave (V2, V3)', 'Compound (V2, V3)', 'Morpho (V1, Blue)', 'Spark Protocol', 'Euler (V1, V2)', 'Fluid', 'Venus Protocol', 'Benqi'].map((protocol) => (
                    <li key={protocol} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {protocol}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4 text-slate-200 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                  Yield &amp; Vaults
                </h3>
                <ul className="space-y-2 text-slate-300">
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
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {protocol.name}
                      {protocol.verified && (
                        <span className="text-xs px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded">
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
        <section className="py-16 px-4 bg-slate-900/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-emerald-400">Supported Blockchains</h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {['Ethereum', 'Arbitrum', 'Optimism', 'Base', 'Polygon', 'Avalanche', 'BNB Chain', 'Gnosis'].map((chain) => (
                <div
                  key={chain}
                  className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700 hover:border-emerald-500/30 transition-colors"
                >
                  <span className="text-slate-200 font-medium">{chain}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stablecoins */}
        <section className="py-16 px-4 border-t border-slate-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-emerald-400">Supported Stablecoins</h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-slate-200">USD Stablecoins</h3>
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
                <h3 className="text-lg font-semibold mb-4 text-slate-200">EUR Stablecoins</h3>
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
                <h3 className="text-lg font-semibold mb-4 text-slate-200">Gold-Backed Tokens</h3>
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
        <section className="py-16 px-4 bg-slate-900/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-emerald-400">Data &amp; Transparency</h2>

            <div className="space-y-6 text-lg text-slate-300 leading-relaxed">
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
                For protocols marked <span className="text-emerald-400">&quot;Verified by Yiield&quot;</span>, we have
                established direct contact with protocol teams to verify information and conduct enhanced
                due diligence.
              </p>
            </div>
          </div>
        </section>

        {/* API Section */}
        <section className="py-16 px-4 border-t border-slate-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-emerald-400">Free Public API</h2>

            <div className="space-y-6 text-lg text-slate-300 leading-relaxed">
              <p>
                Yiield offers a <strong className="text-white">free, unlimited API</strong> for developers
                who want to integrate stablecoin yield data with security scores into their applications.
              </p>
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <code className="text-emerald-400">https://api.yiield.xyz/v1/pools</code>
              </div>
            </div>

            <Link
              href="/developers"
              className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors font-medium"
            >
              View API Documentation
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 px-4 bg-slate-900/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-emerald-400">About COMMIT MEDIA</h2>

            <div className="space-y-6 text-lg text-slate-300 leading-relaxed">
              <p>
                Yiield is developed by <strong className="text-white">COMMIT MEDIA</strong>, an independent
                team focused on building tools that improve DeFi transparency and user safety.
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
        <section className="py-20 px-4 border-t border-slate-800 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Get in Touch</h2>
            <p className="text-lg text-slate-400 mb-8">
              Have questions, feedback, or want to suggest a protocol for inclusion?
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="mailto:contact@yiield.xyz"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                contact@yiield.xyz
              </a>
              <a
                href="https://twitter.com/yiield_xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                @yiield_xyz
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-slate-800">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-sm">
            <p>© 2025 COMMIT MEDIA. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="/" className="hover:text-emerald-400 transition-colors">Compare Yields</Link>
              <Link href="/developers" className="hover:text-emerald-400 transition-colors">API</Link>
              <Link href="/faq" className="hover:text-emerald-400 transition-colors">FAQ</Link>
              <a
                href="https://aleph.cloud"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition-colors"
              >
                Hosted on Aleph Cloud
              </a>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
