'use client';

import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';

interface FiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedChain: string;
  setSelectedChain: (chain: string) => void;
  minTVL: number;
  setMinTVL: (tvl: number) => void;
}

export default function Filters({
  searchQuery,
  setSearchQuery,
  selectedChain,
  setSelectedChain,
  minTVL,
  setMinTVL,
}: FiltersProps) {
  const t = useTranslations('filters');

  const chains = [
    { value: 'all', label: 'All Chains' },
    { value: 'ethereum', label: 'Ethereum' },
    { value: 'arbitrum', label: 'Arbitrum' },
    { value: 'optimism', label: 'Optimism' },
    { value: 'base', label: 'Base' },
    { value: 'polygon', label: 'Polygon' },
    { value: 'avalanche', label: 'Avalanche' },
    { value: 'bsc', label: 'BNB Chain' },
    { value: 'linea', label: 'Linea' },
  ];

  const tvlOptions = [
    { value: 0, label: 'All TVL' },
    { value: 1000000, label: '$1M+' },
    { value: 5000000, label: '$5M+' },
    { value: 10000000, label: '$10M+' },
    { value: 50000000, label: '$50M+' },
    { value: 100000000, label: '$100M+' },
  ];

  return (
    <div className="w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder={t('search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
          />
        </div>

        {/* Chain Filter */}
        <div>
          <select
            value={selectedChain}
            onChange={(e) => setSelectedChain(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
          >
            {chains.map((chain) => (
              <option key={chain.value} value={chain.value}>
                {chain.label}
              </option>
            ))}
          </select>
        </div>

        {/* TVL Filter */}
        <div>
          <select
            value={minTVL}
            onChange={(e) => setMinTVL(Number(e.target.value))}
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
          >
            {tvlOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
