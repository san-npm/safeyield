'use client';

import { StablecoinType, FilterState } from '@/types';
import { X, Filter, ChevronDown, DollarSign, Euro, Coins } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { translations, Locale } from '@/utils/i18n';

interface FiltersProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  availableChains: string[];
  locale?: Locale;
}

// Stablecoins groupés par devise
const USD_STABLECOINS: { type: StablecoinType; label: string }[] = [
  { type: 'USDC', label: 'USDC' },
  { type: 'USDT', label: 'USDT' },
  { type: 'DAI', label: 'DAI' },
  { type: 'PYUSD', label: 'PYUSD' },
  { type: 'USDe', label: 'USDe' },
  { type: 'USD1', label: 'USD1' },
  { type: 'USDG', label: 'USDG' },
];

const EUR_STABLECOINS: { type: StablecoinType; label: string }[] = [
  { type: 'EURe', label: 'EURe' },
  { type: 'EURC', label: 'EURC' },
];

const GOLD_TOKENS: { type: StablecoinType; label: string }[] = [
  { type: 'XAUT', label: 'XAUT (Tether Gold)' },
  { type: 'PAXG', label: 'PAXG (Pax Gold)' },
];

// Toutes les chaînes disponibles
const ALL_CHAINS: { name: string; color: string }[] = [
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
  { name: 'Plasma', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  { name: 'Stable', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
];

export function Filters({ filters, onFilterChange, availableChains, locale = 'en' }: FiltersProps) {
  const t = translations[locale];
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  // Sélectionner/Désélectionner tous les USD
  const toggleAllUSD = () => {
    const usdTypes = USD_STABLECOINS.map(s => s.type);
    const allSelected = usdTypes.every(t => filters.stablecoins?.includes(t));
    if (allSelected) {
      onFilterChange({ stablecoins: filters.stablecoins?.filter(s => !usdTypes.includes(s)) || [] });
    } else {
      const newStables = [...new Set([...(filters.stablecoins || []), ...usdTypes])];
      onFilterChange({ stablecoins: newStables });
    }
  };

  // Sélectionner/Désélectionner tous les EUR
  const toggleAllEUR = () => {
    const eurTypes = EUR_STABLECOINS.map(s => s.type);
    const allSelected = eurTypes.every(t => filters.stablecoins?.includes(t));
    if (allSelected) {
      onFilterChange({ stablecoins: filters.stablecoins?.filter(s => !eurTypes.includes(s)) || [] });
    } else {
      const newStables = [...new Set([...(filters.stablecoins || []), ...eurTypes])];
      onFilterChange({ stablecoins: newStables });
    }
  };

  // Sélectionner/Désélectionner tous les GOLD
  const toggleAllGOLD = () => {
    const goldTypes = GOLD_TOKENS.map(s => s.type);
    const allSelected = goldTypes.every(t => filters.stablecoins?.includes(t));
    if (allSelected) {
      onFilterChange({ stablecoins: filters.stablecoins?.filter(s => !goldTypes.includes(s)) || [] });
    } else {
      const newStables = [...new Set([...(filters.stablecoins || []), ...goldTypes])];
      onFilterChange({ stablecoins: newStables });
    }
  };

  const clearFilters = () => {
    onFilterChange({ stablecoins: [], chains: [], minApy: 0, minTvl: 0, minSecurityScore: 0 });
  };

  const activeFiltersCount = (filters.stablecoins?.length || 0) + (filters.chains?.length || 0) + 
    (filters.minApy > 0 ? 1 : 0) + (filters.minTvl > 0 ? 1 : 0) + (filters.minSecurityScore > 0 ? 1 : 0);
  const hasActiveFilters = activeFiltersCount > 0;

  const usdSelected = USD_STABLECOINS.filter(s => filters.stablecoins?.includes(s.type)).length;
  const eurSelected = EUR_STABLECOINS.filter(s => filters.stablecoins?.includes(s.type)).length;
  const goldSelected = GOLD_TOKENS.filter(s => filters.stablecoins?.includes(s.type)).length;
  const chainsSelected = filters.chains?.length || 0;

  return (
    <div className="mb-6" ref={dropdownRef}>
      {/* Bouton principal */}
      <div className="flex items-center gap-3 flex-wrap">
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
            hasActiveFilters 
              ? 'bg-safe-500/10 border-safe-500/30 text-safe-400' 
              : 'bg-white/5 border-white/10 text-white/70 hover:border-white/20'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span className="font-medium">{t['filters.title']}</span>
          {hasActiveFilters && (
            <span className="bg-safe-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
              {activeFiltersCount}
            </span>
          )}
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Tags des filtres actifs */}
        {hasActiveFilters && (
          <>
            {usdSelected > 0 && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm">
                <DollarSign className="w-3 h-3" />
                USD ({usdSelected})
              </span>
            )}
            {eurSelected > 0 && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm">
                <Euro className="w-3 h-3" />
                EUR ({eurSelected})
              </span>
            )}
            {goldSelected > 0 && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm">
                <Coins className="w-3 h-3" />
                GOLD ({goldSelected})
              </span>
            )}
            {chainsSelected > 0 && (
              <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 text-sm">
                {chainsSelected} {t['filters.networks'].toLowerCase()}
              </span>
            )}
            <button 
              onClick={clearFilters} 
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-3 h-3" />
              {t['filters.clear']}
            </button>
          </>
        )}
      </div>

      {/* Dropdown Modal */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full max-w-2xl bg-dark-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-5">
            {/* Section Stablecoins */}
            <div className="mb-6">
              <div className="text-xs text-white/40 mb-3 uppercase tracking-wide font-semibold">{t['filters.stablecoins']}</div>
              
              {/* Groupe USD */}
              <div className="mb-4">
                <button 
                  onClick={toggleAllUSD}
                  className={`flex items-center gap-2 mb-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    usdSelected === USD_STABLECOINS.length 
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  USD
                  {usdSelected > 0 && usdSelected < USD_STABLECOINS.length && (
                    <span className="text-xs text-white/40">({usdSelected}/{USD_STABLECOINS.length})</span>
                  )}
                </button>
                <div className="flex flex-wrap gap-2 ml-6">
                  {USD_STABLECOINS.map(({ type, label }) => {
                    const isActive = filters.stablecoins?.includes(type);
                    return (
                      <button 
                        key={type} 
                        onClick={() => toggleStablecoin(type)} 
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                          isActive 
                            ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' 
                            : 'bg-white/5 text-white/60 border-white/10 hover:border-white/20'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Groupe EUR */}
              <div className="mb-4">
                <button 
                  onClick={toggleAllEUR}
                  className={`flex items-center gap-2 mb-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    eurSelected === EUR_STABLECOINS.length 
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Euro className="w-4 h-4" />
                  EUR
                  {eurSelected > 0 && eurSelected < EUR_STABLECOINS.length && (
                    <span className="text-xs text-white/40">({eurSelected}/{EUR_STABLECOINS.length})</span>
                  )}
                </button>
                <div className="flex flex-wrap gap-2 ml-6">
                  {EUR_STABLECOINS.map(({ type, label }) => {
                    const isActive = filters.stablecoins?.includes(type);
                    return (
                      <button 
                        key={type} 
                        onClick={() => toggleStablecoin(type)} 
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                          isActive 
                            ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' 
                            : 'bg-white/5 text-white/60 border-white/10 hover:border-white/20'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Groupe GOLD */}
              <div>
                <button 
                  onClick={toggleAllGOLD}
                  className={`flex items-center gap-2 mb-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    goldSelected === GOLD_TOKENS.length 
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Coins className="w-4 h-4" />
                  GOLD
                  {goldSelected > 0 && goldSelected < GOLD_TOKENS.length && (
                    <span className="text-xs text-white/40">({goldSelected}/{GOLD_TOKENS.length})</span>
                  )}
                </button>
                <div className="flex flex-wrap gap-2 ml-6">
                  {GOLD_TOKENS.map(({ type, label }) => {
                    const isActive = filters.stablecoins?.includes(type);
                    return (
                      <button 
                        key={type} 
                        onClick={() => toggleStablecoin(type)} 
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                          isActive 
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' 
                            : 'bg-white/5 text-white/60 border-white/10 hover:border-white/20'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Section Chaînes */}
            <div className="mb-6">
              <div className="text-xs text-white/40 mb-3 uppercase tracking-wide font-semibold">{t['filters.networks']}</div>
              <div className="flex flex-wrap gap-2">
                {ALL_CHAINS.filter(c => availableChains.includes(c.name)).map(({ name, color }) => {
                  const isActive = filters.chains?.includes(name);
                  return (
                    <button 
                      key={name} 
                      onClick={() => toggleChain(name)} 
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                        isActive ? color : 'bg-white/5 text-white/60 border-white/10 hover:border-white/20'
                      }`}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filtres avancés */}
            <div className="pt-4 border-t border-white/5">
              <div className="text-xs text-white/40 mb-3 uppercase tracking-wide font-semibold">{t['filters.advanced']}</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-white/40 mb-1 block">{t['filters.minApy']}</label>
                  <input 
                    type="number" 
                    value={filters.minApy || ''} 
                    onChange={(e) => onFilterChange({ minApy: Number(e.target.value) || 0 })} 
                    placeholder="0%" 
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-safe-500/50 transition-colors" 
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1 block">{t['filters.minTvl']}</label>
                  <select 
                    value={filters.minTvl || 0} 
                    onChange={(e) => onFilterChange({ minTvl: Number(e.target.value) })} 
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-safe-500/50 transition-colors"
                  >
                    <option value={0}>{t['filters.all']}</option>
                    <option value={1000000}>+ $1M</option>
                    <option value={10000000}>+ $10M</option>
                    <option value={100000000}>+ $100M</option>
                    <option value={500000000}>+ $500M</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1 block">{t['filters.minSecurity']}</label>
                  <select 
                    value={filters.minSecurityScore || 0} 
                    onChange={(e) => onFilterChange({ minSecurityScore: Number(e.target.value) })} 
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-safe-500/50 transition-colors"
                  >
                    <option value={0}>{t['filters.all']}</option>
                    <option value={60}>{t['filters.good']} (60+)</option>
                    <option value={80}>{t['filters.excellent']} (80+)</option>
                    <option value={90}>{t['filters.premium']} (90+)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Footer du dropdown */}
          <div className="flex items-center justify-between px-5 py-3 bg-white/5 border-t border-white/5">
            <button 
              onClick={clearFilters} 
              className="text-sm text-white/50 hover:text-white transition-colors"
            >
              {t['filters.clear']}
            </button>
            <button 
              onClick={() => setIsOpen(false)} 
              className="px-4 py-2 bg-safe-500 hover:bg-safe-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {t['filters.apply']}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
