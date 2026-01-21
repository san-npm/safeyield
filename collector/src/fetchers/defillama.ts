// ============================================
// DefiLlama Pools Fetcher
// ============================================

import { CONFIG } from '../config.js';
import { PoolData, StablecoinType } from '../types.js';

interface DefiLlamaPool {
  pool: string;
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apy: number;
  apyBase: number;
  apyReward: number;
  stablecoin: boolean;
}

interface DefiLlamaResponse {
  data: DefiLlamaPool[];
}

/**
 * Detect stablecoin type from symbol
 */
function detectStablecoin(symbol: string): StablecoinType | null {
  const upperSymbol = symbol.toUpperCase();
  for (const [key, value] of Object.entries(CONFIG.SUPPORTED_STABLECOINS)) {
    if (upperSymbol.includes(key)) {
      return value as StablecoinType;
    }
  }
  return null;
}

/**
 * Create a unique pool ID
 */
function createPoolId(pool: DefiLlamaPool, stablecoin: StablecoinType): string {
  const chainSlug = pool.chain.toLowerCase().replace(/\s+/g, '-');
  return `${pool.project}-${stablecoin.toLowerCase()}-${chainSlug}`;
}

/**
 * Fetch pools from DefiLlama API
 */
export async function fetchDefiLlamaPools(): Promise<PoolData[]> {
  console.log('🔄 Fetching pools from DefiLlama...');

  const response = await fetch(CONFIG.DEFILLAMA_API, {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`DefiLlama API error: ${response.status}`);
  }

  const json = await response.json() as DefiLlamaResponse;
  const pools: DefiLlamaPool[] = json.data || [];

  const filteredPools: PoolData[] = [];

  for (const pool of pools) {
    // Check if protocol is allowed
    if (!CONFIG.ALLOWED_PROTOCOLS.includes(pool.project)) {
      continue;
    }

    // Only stablecoins
    if (!pool.stablecoin) {
      continue;
    }

    // Only supported chains
    if (!CONFIG.SUPPORTED_CHAINS.includes(pool.chain)) {
      continue;
    }

    // Get main symbol (before hyphen for LP tokens)
    const symbol = pool.symbol?.toUpperCase() || '';
    const mainSymbol = symbol.split('-')[0] || '';

    // Filter LP pools with non-stablecoin tokens
    if (symbol.includes('-')) {
      const parts = symbol.split('-');
      const allPartsAreStablecoins = parts.every((part: string) =>
        Object.keys(CONFIG.SUPPORTED_STABLECOINS).some(s => part.includes(s))
      );
      if (!allPartsAreStablecoins) continue;
    }

    // Detect stablecoin type
    const stablecoin = detectStablecoin(mainSymbol);
    if (!stablecoin) continue;

    // TVL minimum
    if (pool.tvlUsd < CONFIG.MIN_TVL) continue;

    // APY valid range
    if (!pool.apy || pool.apy <= 0 || pool.apy > CONFIG.MAX_APY) continue;

    filteredPools.push({
      id: createPoolId(pool, stablecoin),
      protocol: pool.project,
      chain: pool.chain,
      stablecoin,
      symbol: pool.symbol,
      apy: pool.apy,
      apyBase: pool.apyBase || pool.apy,
      apyReward: pool.apyReward || 0,
      tvl: pool.tvlUsd,
    });
  }

  console.log(`✅ DefiLlama: ${filteredPools.length} pools fetched`);
  return filteredPools;
}
