'use client';

import { StablecoinType, FilterState } from '@/types';
import { X, Filter, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { translations, Locale } from '@/app/page';

interface FiltersProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  availableChains: string[];
  locale?: Locale;
}

const STABLECOINS: { type: StablecoinType; label: string; color: string }[] = [
  { type: 'USDC', label: 'USDC', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { type: 'USDT', label: 'USDT', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  { type: 'USDT0', label: 'USDT0', color: 'bg-teal-500/20 text-teal-400 border-teal-500/30' },
  { type: 'DAI', label: 'DAI', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  { type: 'USDS', label: 'USDS', color: 'bg-sky-500/20 text-sky-400 border-sky-500/30' },
  { type: 'PYUSD', label: 'PYUSD', color: 'bg-blue-600/20 text-blue-300 border-blue-600/30' },
  { type: 'EURe', label: 'EURe', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { type: 'EURC', label: 'EURC', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
];

const CHAINS: { name: string; color: string }[] = [
  { name: 'Ethereum', color: 'bg-slate-500/20 text-slate-300 border-slate-500/30' },
  { name: 'Arbitrum', color: 'bg-blue-600/20 text-blue-400 border-blue-600/30' },
  { name: 'Optimism', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  { name: 'Base', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  { name: 'Polygon', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { name: 'BSC', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  { name: 'Avalanche', color: 'bg-red-600/20 text-red-400 border-red-600/30' },
  { name: 'Solana', color: 'bg-gradient-to-r from-purple-500/20 to-teal-500/20 text-purple-300 border-purple-500/30' },
  { name: 'Gnosis', color: 'bg-emerald-600/20 text-emerald-400 border-emerald-600/30' },
  { name: 'Linea', color: 'bg-slate-400/20 text-slate-300 border-slate-400/30' },
];

export function Filters({ filters, onFilterChange, availableChains, locale = 'en' }: FiltersProps) {
  const t = translations[locale];
  const [showAdvanced, setShowAdvanced] = useState(false);

  const toggleStablecoin = (stablecoin: StablecoinType) => {
    const current = filters.stablecoins || [];
    const updated = current.includes(stablecoin) ? current.filter(s => s !== stablecoin) : [...current, stablecoin];
    onFilterChange({ stablecoins: updated });
  };

  const toggleChain = (chain: string) => {
    const current = filters.chains || [];
    const updated = current.includes(chain) ? current.filter(c => c !== chain) : [...current, chain];
    onFilterChange({ chains: updated });
  };

  const clearFilters = () => {
    onFilterChange({ stablecoins: [], chains: [], minApy: 0, minTvl: 0, minSecurityScore: 0 });
  };

  const hasActiveFilters = (filters.stablecoins?.length || 0) > 0 || (filters.chains?.length || 0) > 0 || filters.minApy > 0 || filters.minTvl > 0 || filters.minSecurityScore > 0;

  return (
    <div className="card p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-white/70">
          <Filter className="w-4 h-4" />
          <span className="font-medium">{t['filters.title']}</span>
          {hasActiveFilters && (
            <span className="badge badge-excellent">{(filters.stablecoins?.length || 0) + (filters.chains?.length || 0)} {t['filters.active']}</span>
          )}
        </div>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="text-sm text-white/50 hover:text-white flex items-center gap-1 transition-colors">
            <X className="w-3 h-3" />{t['filters.clear']}
          </button>
        )}
      </div>

      <div className="mb-4">
        <div className="text-xs text-white/40 mb-2 uppercase tracking-wide">{t['filters.stablecoins']}</div>
        <div className="flex flex-wrap gap-2">
          {STABLECOINS.map(({ type, label, color }) => {
            const isActive = filters.stablecoins?.includes(type);
            return (
              <button key={type} onClick={() => toggleStablecoin(type)} className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${isActive ? color : 'bg-white/5 text-white/60 border-white/10 hover:border-white/20'}`}>
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-4">
        <div className="text-xs text-white/40 mb-2 uppercase tracking-wide">{t['filters.networks']}</div>
        <div className="flex flex-wrap gap-2">
          {CHAINS.filter(c => availableChains.includes(c.name)).map(({ name, color }) => {
            const isActive = filters.chains?.includes(name);
            return (
              <button key={name} onClick={() => toggleChain(name)} className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${isActive ? color : 'bg-white/5 text-white/60 border-white/10 hover:border-white/20'}`}>
                {name}
              </button>
            );
          })}
        </div>
      </div>

      <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center gap-1 text-sm text-white/50 hover:text-white transition-colors">
        <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
        {t['filters.advanced']}
      </button>

      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-white/40 mb-1 block">{t['filters.minApy']}</label>
            <input type="number" value={filters.minApy || ''} onChange={(e) => onFilterChange({ minApy: Number(e.target.value) || 0 })} placeholder="0%" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-safe-500/50 transition-colors" />
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1 block">{t['filters.minTvl']}</label>
            <select value={filters.minTvl || 0} onChange={(e) => onFilterChange({ minTvl: Number(e.target.value) })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-safe-500/50 transition-colors">
              <option value={0}>{t['filters.all']}</option>
              <option value={1000000}>+ $1M</option>
              <option value={10000000}>+ $10M</option>
              <option value={100000000}>+ $100M</option>
              <option value={500000000}>+ $500M</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1 block">{t['filters.minSecurity']}</label>
            <select value={filters.minSecurityScore || 0} onChange={(e) => onFilterChange({ minSecurityScore: Number(e.target.value) })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-safe-500/50 transition-colors">
              <option value={0}>{t['filters.all']}</option>
              <option value={60}>{t['filters.good']} (60+)</option>
              <option value={80}>{t['filters.excellent']} (80+)</option>
              <option value={90}>{t['filters.premium']} (90+)</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
