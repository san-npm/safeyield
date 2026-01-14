'use client';

import { useState, useEffect } from 'react';
import { Pool, PoolWithSecurity } from '@/types';
import {
  fetchPools,
  filterStablecoinPools,
  sortPoolsByApy,
  filterByChain,
  filterByMinTVL,
  searchPools,
} from '@/utils/api';
import { addSecurityScore } from '@/utils/security';

export function usePools() {
  const [pools, setPools] = useState<PoolWithSecurity[]>([]);
  const [filteredPools, setFilteredPools] = useState<PoolWithSecurity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChain, setSelectedChain] = useState('all');
  const [minTVL, setMinTVL] = useState(0);

  useEffect(() => {
    async function loadPools() {
      try {
        setLoading(true);
        const allPools = await fetchPools();
        const stablePools = filterStablecoinPools(allPools);
        const sortedPools = sortPoolsByApy(stablePools);
        const poolsWithSecurity = sortedPools.map(addSecurityScore);

        setPools(poolsWithSecurity);
        setFilteredPools(poolsWithSecurity.slice(0, 50)); // Top 50 initially
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load pools');
      } finally {
        setLoading(false);
      }
    }

    loadPools();
  }, []);

  useEffect(() => {
    let result = [...pools];

    // Apply filters
    result = filterByChain(result, selectedChain) as PoolWithSecurity[];
    result = filterByMinTVL(result, minTVL) as PoolWithSecurity[];
    result = searchPools(result, searchQuery) as PoolWithSecurity[];

    // Limit to top 50
    result = result.slice(0, 50);

    setFilteredPools(result);
  }, [pools, searchQuery, selectedChain, minTVL]);

  return {
    pools: filteredPools,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedChain,
    setSelectedChain,
    minTVL,
    setMinTVL,
  };
}
