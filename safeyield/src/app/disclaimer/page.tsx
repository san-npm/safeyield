'use client';

import Link from 'next/link';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-dark-950">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-yellow-500/10">
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">Risk Disclaimer</h1>
            <p className="text-white/60">Please read carefully before using DeFi</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <section className="card p-6 border-yellow-500/20">
            <h2 className="text-xl font-semibold text-yellow-500 mb-3">⚠️ Important Warning</h2>
            <p className="text-white/60 leading-relaxed">
              DeFi investments carry significant risks including potential complete loss of funds. This is not financial advice.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="text-xl font-semibold text-white mb-3">Smart Contract Risk</h2>
            <p className="text-white/60 leading-relaxed">
              All DeFi protocols operate through smart contracts which may contain bugs or vulnerabilities. Even audited protocols can be hacked.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="text-xl font-semibold text-white mb-3">Market Risk</h2>
            <p className="text-white/60 leading-relaxed">
              Cryptocurrency markets are highly volatile. Yields can change rapidly. Stablecoins can depeg in extreme conditions.
            </p>
          </section>

          <section className="card p-6 border-safe-500/20">
            <h2 className="text-xl font-semibold text-safe-400 mb-3">Best Practices</h2>
            <ul className="list-disc list-inside text-white/60 space-y-2">
              <li>Never invest more than you can afford to lose</li>
              <li>Diversify across multiple protocols</li>
              <li>Start with small amounts</li>
              <li>Verify protocol URLs before interacting</li>
              <li>Stay informed about protocol updates</li>
            </ul>
          </section>

          <section className="card p-6 bg-red-500/5 border-red-500/20">
            <h2 className="text-xl font-semibold text-red-400 mb-3">No Liability</h2>
            <p className="text-white/60 leading-relaxed">
              Yiield provides information only. We are not responsible for any losses. You accept full responsibility for your investment decisions.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
