'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-dark-950">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold text-white mb-2">Terms of Use</h1>
        <p className="text-white/60 mb-8">Last updated: January 2026</p>
        
        <div className="space-y-6">
          <section className="card p-6">
            <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
            <p className="text-white/60 leading-relaxed">
              By accessing and using Yiield, you agree to be bound by these Terms of Use.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="text-xl font-semibold text-white mb-3">2. Description of Service</h2>
            <p className="text-white/60 leading-relaxed">
              Yiield is an informational platform that aggregates yield data from DeFi protocols. We do not provide financial advice or handle user funds.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="text-xl font-semibold text-white mb-3">3. No Financial Advice</h2>
            <p className="text-white/60 leading-relaxed">
              Information provided is for informational purposes only. Always do your own research before making investment decisions.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="text-xl font-semibold text-white mb-3">4. User Responsibilities</h2>
            <p className="text-white/60 leading-relaxed">
              Users are solely responsible for their investment decisions. DeFi investments carry significant risks including potential loss of funds.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="text-xl font-semibold text-white mb-3">5. Limitation of Liability</h2>
            <p className="text-white/60 leading-relaxed">
              Yiield shall not be liable for any damages arising from the use of this Service or reliance on information provided.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="text-xl font-semibold text-white mb-3">6. Contact</h2>
            <p className="text-white/60 leading-relaxed">
              For questions, contact us at legal@yiield.xyz
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
