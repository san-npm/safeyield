'use client';

import Link from 'next/link';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left"
      >
        <span className="font-medium text-white pr-6 leading-relaxed">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-safe-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-white/40 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="pb-6 text-white/60 leading-relaxed pr-8">{answer}</div>
      )}
    </div>
  );
}

const faqs = [
  { q: "What is Yiield?", a: "Yiield is a DeFi yield comparison platform that helps you find the best stablecoin yields across various protocols with security scores." },
  { q: "How is the security score calculated?", a: "Our score (0-100) is based on: audits (25 pts), protocol age (25 pts), TVL (25 pts), and exploit history (25 pts)." },
  { q: "What are stablecoins?", a: "Stablecoins are cryptocurrencies pegged to fiat currencies. USD-pegged: USDC, USDT, DAI. EUR-pegged: EURe, EURC." },
  { q: "What is APY?", a: "APY (Annual Percentage Yield) is the real rate of return over a year, including compound interest." },
  { q: "Is Yiield free?", a: "Yes, Yiield is completely free. You interact directly with protocols' smart contracts." },
  { q: "What's Lending vs Vault?", a: "Lending protocols let you lend directly to borrowers. Vault managers optimize yields across multiple strategies." },
  { q: "How often is data updated?", a: "Data is refreshed hourly from DefiLlama's API." },
  { q: "What are the risks?", a: "DeFi carries risks: smart contract bugs, oracle failures, market volatility. DYOR and invest responsibly." },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-dark-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        
        <h1 className="text-4xl font-bold text-white mb-3">FAQ</h1>
        <p className="text-white/60 mb-10 text-lg">Frequently Asked Questions</p>
        
        <div className="card px-6">
          {faqs.map((faq, i) => (
            <FAQItem key={i} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </div>
    </div>
  );
}
