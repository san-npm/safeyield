'use client';

import { useTranslations } from 'next-intl';
import Hero from '@/components/Hero';
import Filters from '@/components/Filters';
import PoolsTable from '@/components/PoolsTable';
import { usePools } from '@/hooks/usePools';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const t = useTranslations();
  const {
    pools,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedChain,
    setSelectedChain,
    minTVL,
    setMinTVL,
  } = usePools();

  return (
    <>
      <Hero />

      <div className="container mx-auto px-4 py-12">
        <Filters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedChain={selectedChain}
          setSelectedChain={setSelectedChain}
          minTVL={minTVL}
          setMinTVL={setMinTVL}
        />

        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-primary-500 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading best yields...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <p className="text-red-800 dark:text-red-200">
              Error loading pools: {error}
            </p>
          </div>
        )}

        {!loading && !error && pools.length === 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 text-center">
            <p className="text-yellow-800 dark:text-yellow-200">
              No pools found matching your criteria.
            </p>
          </div>
        )}

        {!loading && !error && pools.length > 0 && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Top Stablecoin Yields
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Showing {pools.length} pools with the highest APY rates
              </p>
            </div>

            <PoolsTable pools={pools} />
          </div>
        )}
      </div>
    </>
  );
}
