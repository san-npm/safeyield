import { Pool } from '@/types';

const DEFILLAMA_API = 'https://yields.llama.fi/pools';

export async function fetchPools(): Promise<Pool[]> {
  try {
    const response = await fetch(DEFILLAMA_API, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error('Failed to fetch pools');
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching pools:', error);
    return [];
  }
}

export function filterStablecoinPools(pools: Pool[]): Pool[] {
  const stablecoins = [
    'USDC',
    'USDT',
    'DAI',
    'USDC.e',
    'USDT.e',
    'USDbC',
    'crvUSD',
    'FRAX',
    'LUSD',
    'sUSD',
    'BUSD',
    'TUSD',
  ];

  return pools.filter((pool) => {
    const symbolUpper = pool.symbol.toUpperCase();
    return stablecoins.some((stable) => symbolUpper.includes(stable));
  });
}

export function sortPoolsByApy(pools: Pool[]): Pool[] {
  return [...pools].sort((a, b) => b.apy - a.apy);
}

export function filterByChain(pools: Pool[], chain: string): Pool[] {
  if (!chain || chain === 'all') return pools;
  return pools.filter((pool) => pool.chain.toLowerCase() === chain.toLowerCase());
}

export function filterByMinTVL(pools: Pool[], minTVL: number): Pool[] {
  if (!minTVL || minTVL <= 0) return pools;
  return pools.filter((pool) => pool.tvlUsd >= minTVL);
}

export function searchPools(pools: Pool[], query: string): Pool[] {
  if (!query) return pools;
  const lowerQuery = query.toLowerCase();
  return pools.filter(
    (pool) =>
      pool.project.toLowerCase().includes(lowerQuery) ||
      pool.symbol.toLowerCase().includes(lowerQuery) ||
      pool.chain.toLowerCase().includes(lowerQuery)
  );
}
