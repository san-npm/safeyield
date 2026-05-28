'use client';

import Link from 'next/link';
import { ArrowLeft, ExternalLink, Copy, Check, Code, Server, Shield, Zap, Database, Globe, Terminal } from 'lucide-react';
import { useState } from 'react';

function CodeBlock({ code, language = 'bash' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <pre className="bg-black/40 rounded-lg p-4 overflow-x-auto text-sm text-white/80 border border-white/10">
        <code>{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
      >
        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white/40" />}
      </button>
    </div>
  );
}

function DataSourceCard({
  name,
  url,
  description,
  example,
}: {
  name: string;
  url: string;
  description: string;
  example: string;
}) {
  return (
    <div className="border border-white/10 rounded-xl p-6 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
      <div className="flex items-center gap-3 mb-4">
        <Database className="w-5 h-5 text-safe-400" />
        <h3 className="text-lg font-semibold text-white">{name}</h3>
      </div>
      <p className="text-white/60 mb-4">{description}</p>
      <div className="mb-4">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-safe-400 hover:text-safe-300 inline-flex items-center gap-1 text-sm"
        >
          {url}
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
      <div className="text-xs text-white/40 uppercase tracking-wider mb-2">Example Request</div>
      <CodeBlock code={example} />
    </div>
  );
}

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-dark-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center gap-4 mb-3">
          <h1 className="text-4xl font-bold text-white">API & Data Sources</h1>
        </div>
        <p className="text-white/60 mb-10 text-lg">
          Access Yiield&apos;s aggregated DeFi yield data through our public API or learn about our data sources.
        </p>

        {/* Yiield Public API - Main Feature */}
        <div className="border-2 border-safe-400/50 rounded-xl p-6 bg-safe-400/5 mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Terminal className="w-6 h-6 text-safe-400" />
            <h2 className="text-2xl font-bold text-white">Yiield Public API</h2>
            <span className="px-2 py-0.5 text-xs font-medium bg-safe-400/20 text-safe-400 rounded">FREE</span>
          </div>
          <p className="text-white/70 mb-6">
            Access our aggregated stablecoin yield data programmatically. Perfect for building dashboards, bots, or integrations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-black/30 rounded-lg p-4">
              <div className="text-white font-medium mb-2">Base URL</div>
              <code className="text-safe-400 text-sm">https://api.yiield.xyz</code>
            </div>
            <div className="bg-black/30 rounded-lg p-4">
              <div className="text-white font-medium mb-2">Rate Limit</div>
              <code className="text-white/60 text-sm">No limit (fair use)</code>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="text-white font-medium">Endpoints</div>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex items-center gap-3 bg-black/20 rounded-lg p-3">
                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs font-mono">GET</span>
                <code className="text-white/80">/api/v1/pools</code>
                <span className="text-white/40 ml-auto">List all stablecoin pools</span>
              </div>
              <div className="flex items-center gap-3 bg-black/20 rounded-lg p-3">
                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs font-mono">GET</span>
                <code className="text-white/80">/api/v1/pools/:id</code>
                <span className="text-white/40 ml-auto">Get pool details</span>
              </div>
              <div className="flex items-center gap-3 bg-black/20 rounded-lg p-3">
                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs font-mono">GET</span>
                <code className="text-white/80">/api/v1/protocols</code>
                <span className="text-white/40 ml-auto">List all protocols</span>
              </div>
              <div className="flex items-center gap-3 bg-black/20 rounded-lg p-3">
                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs font-mono">GET</span>
                <code className="text-white/80">/api/v1/stats</code>
                <span className="text-white/40 ml-auto">Aggregated statistics</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-white/40 uppercase tracking-wider mb-2">Quick Start</div>
          <CodeBlock code={`# Get top USDC pools by APY
curl "https://api.yiield.xyz/api/v1/pools?stablecoin=USDC&sort=apy&order=desc&limit=10"

# Get all Ethereum pools with >5% APY
curl "https://api.yiield.xyz/api/v1/pools?chain=Ethereum&minApy=5"

# Get protocol statistics
curl "https://api.yiield.xyz/api/v1/stats"`} />

          <div className="mt-4 flex gap-3">
            <a
              href="https://api.yiield.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm"
            >
              Try API
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
            <a
              href="https://github.com/san-npm/safeyield/tree/main/api-server"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition-colors text-sm inline-flex items-center gap-1"
            >
              View Source
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="card p-4 flex items-start gap-3">
            <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-white font-medium">Real-time Data</div>
              <div className="text-white/50 text-sm">Updated hourly from multiple APIs</div>
            </div>
          </div>
          <div className="card p-4 flex items-start gap-3">
            <Shield className="w-5 h-5 text-safe-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-white font-medium">Security Scores</div>
              <div className="text-white/50 text-sm">Proprietary risk assessment</div>
            </div>
          </div>
          <div className="card p-4 flex items-start gap-3">
            <Globe className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-white font-medium">100+ Protocols</div>
              <div className="text-white/50 text-sm">Across 15+ blockchains</div>
            </div>
          </div>
        </div>

        {/* Primary Data Sources */}
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Database className="w-6 h-6" />
          Primary Data Sources
        </h2>

        <div className="space-y-6 mb-12">
          <DataSourceCard
            name="DefiLlama Yields"
            url="https://yields.llama.fi/pools"
            description="Primary source for yield data across DeFi protocols. Provides APY, TVL, and protocol information for thousands of pools."
            example={`curl "https://yields.llama.fi/pools"

# Response includes:
# - pool: Unique pool identifier
# - chain: Blockchain name
# - project: Protocol name
# - symbol: Token symbol
# - tvlUsd: Total Value Locked in USD
# - apy: Current APY percentage
# - apyBase: Base APY without rewards
# - apyReward: Additional reward APY`}
          />

          <DataSourceCard
            name="Merkl API"
            url="https://api.merkl.xyz/v4/opportunities"
            description="Additional incentive rewards from Merkl campaigns. Provides extra APR for participating pools."
            example={`curl "https://api.merkl.xyz/v4/opportunities?chainId=1"

# Query by chain ID:
# - 1: Ethereum
# - 42161: Arbitrum
# - 10: Optimism
# - 137: Polygon
# - 8453: Base`}
          />

          <DataSourceCard
            name="Aleph IPFS Storage"
            url="https://api2.aleph.im/api/v0/storage/raw/"
            description="Historical APY data stored on decentralized IPFS via Aleph. Updated hourly by our collector."
            example={`# Fetch the current index hash
curl "https://www.yiield.xyz/apy-history-hash.txt"

# Use hash to fetch index
curl "https://api2.aleph.im/api/v0/storage/raw/{HASH}"

# Index contains pool hashes for individual history`}
          />

          <DataSourceCard
            name="The Graph - RealT RMM"
            url="https://gateway.thegraph.com/api/subgraphs/id/2xrWGGZ5r8Z7wdNdHxhbRVKcAD2dDgv3F2NcjrZmxifJ"
            description="RealT RMM protocol data from The Graph. Provides tokenized real estate yields on Gnosis chain."
            example={`curl -X POST \\
  "https://gateway.thegraph.com/api/{API_KEY}/subgraphs/id/2xrWGGZ5r8Z7wdNdHxhbRVKcAD2dDgv3F2NcjrZmxifJ" \\
  -H "Content-Type: application/json" \\
  -d '{"query": "{ reserves { symbol liquidityRate totalLiquidity } }"}'`}
          />
        </div>

        {/* Protocol-Specific APIs */}
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Server className="w-6 h-6" />
          Protocol-Specific APIs
        </h2>

        <div className="card p-6 mb-8">
          <p className="text-white/60 mb-6">
            We also fetch data directly from protocol APIs for more accurate TVL and APY information:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'Kamino Finance', chain: 'Solana', url: 'api.kamino.finance' },
              { name: 'Fluid Protocol', chain: 'Multi-chain', url: 'api.fluid.instadapp.io' },
              { name: 'Venus Protocol', chain: 'BSC', url: 'api.venus.io' },
              { name: 'Jupiter Lend', chain: 'Solana', url: 'jup.ag API' },
              { name: 'Felix Protocol', chain: 'Hyperliquid', url: 'felix.money API' },
              { name: 'HyperLend', chain: 'Hyperliquid', url: 'app.hyperlend.finance' },
            ].map((protocol) => (
              <div key={protocol.name} className="flex items-center justify-between p-3 rounded-lg bg-black/20">
                <div>
                  <div className="text-white font-medium">{protocol.name}</div>
                  <div className="text-white/40 text-xs">{protocol.chain}</div>
                </div>
                <code className="text-xs text-white/50">{protocol.url}</code>
              </div>
            ))}
          </div>
        </div>

        {/* Security Scoring */}
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Shield className="w-6 h-6" />
          Security Scoring
        </h2>

        <div className="card p-6 mb-8">
          <p className="text-white/60 mb-4">
            Our security score (0-100) is calculated based on:
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-black/20">
              <span className="text-white">Audits</span>
              <span className="text-safe-400 font-medium">25 points max</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-black/20">
              <span className="text-white">Protocol Age</span>
              <span className="text-safe-400 font-medium">25 points max</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-black/20">
              <span className="text-white">Total Value Locked</span>
              <span className="text-safe-400 font-medium">25 points max</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-black/20">
              <span className="text-white">Exploit History</span>
              <span className="text-safe-400 font-medium">25 points max</span>
            </div>
          </div>
          <p className="text-white/50 text-sm mt-4">
            The Yiield Score adds bonuses for tier-1 auditors, doxxed teams, insurance coverage, and DAO governance.
          </p>
        </div>

        {/* Links */}
        <div className="mt-12 flex items-center gap-4">
          <a
            href="https://github.com/san-npm/safeyield"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            View on GitHub
            <ExternalLink className="w-4 h-4 ml-2" />
          </a>
          <a
            href="https://defillama.com/yields"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition-colors inline-flex items-center gap-2"
          >
            DefiLlama Yields
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
