'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-dark-950">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-white/60 mb-8">Last updated: January 2026</p>
        
        <div className="space-y-6">
          <section className="card p-6">
            <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
            <p className="text-white/60 leading-relaxed">
              Yiield collects minimal data: language preference (stored locally), basic analytics (anonymized). No wallet addresses or personal information.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="text-xl font-semibold text-white mb-3">2. No Account Required</h2>
            <p className="text-white/60 leading-relaxed">
              You can use all features without providing any personal information.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="text-xl font-semibold text-white mb-3">3. Cookies and Local Storage</h2>
            <p className="text-white/60 leading-relaxed">
              We use local storage to save preferences. No tracking cookies or data sharing with advertisers.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="text-xl font-semibold text-white mb-3">4. Third-Party Links</h2>
            <p className="text-white/60 leading-relaxed">
              Deposit buttons redirect to third-party DeFi protocols with their own privacy policies.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="text-xl font-semibold text-white mb-3">5. Contact</h2>
            <p className="text-white/60 leading-relaxed">
              For privacy questions, contact us at privacy@yiield.xyz
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
