// ============================================
// 📊 DATA FETCHER - Server-side data fetching for API routes
// ============================================
// Simplified version that works with the existing type system

import { YieldPool, DefiLlamaPool, StablecoinType } from '@/types';
import { YIIELD_PROTOCOLS } from '@/data/yiieldProtocols';
import { cache } from './utils';

// ============================================
// CONFIGURATION
// ============================================

const MIN_SECURITY_SCORE = 60;
const DEFILLAMA_API_URL = 'https://yields.llama.fi/pools';
const ALEPH_STORAGE_URL = 'https://api2.aleph.im/api/v0/storage/raw/';

// Cache TTLs
const POOLS_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const HISTORY_INDEX_CACHE_TTL = 10 * 60 * 1000; // 10 minutes
const HASH_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// ============================================
// TYPES
// ============================================

interface HistoryIndex {
  version: string;
  lastCollected: string;
  totalPools: number;
  pools: Record<string, { hash: string; latestApy: number; latestTvl: number }>;
}

interface PoolHistoryData {
  poolId: string;
  hourly: { t: string; apy: number; tvl: number }[];
}

// Simple protocol info for data-fetcher
interface ProtocolInfo {
  name: string;
  type: 'lending' | 'vault';
  audits: number;
  launchYear: number;
  exploits: number;
  url: string;
  logo: string;
}

// Convert YIIELD_PROTOCOLS to simple format
const PROTOCOL_LOOKUP: Record<string, ProtocolInfo> = Object.entries(YIIELD_PROTOCOLS).reduce((acc, [slug, info]) => {
  acc[slug] = {
    name: info.name,
    type: 'lending', // Default to lending
    audits: info.auditors?.length || 0,
    launchYear: 2022, // Default year
    exploits: 0,
    url: '',
    logo: `https://icons.llama.fi/${slug}.png`,
  };
  return acc;
}, {} as Record<string, ProtocolInfo>);

// ============================================
// HISTORY DATA FETCHING
// ============================================

async function getHistoryHash(): Promise<string> {
  const cached = cache.get<string>('history-hash', HASH_CACHE_TTL);
  if (cached) return cached;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://app.yiield.xyz';
    const response = await fetch(`${baseUrl}/apy-history-hash.txt`, {
      cache: 'no-store',
    });
    if (response.ok) {
      const hash = (await response.text()).trim();
      if (hash && /^[a-f0-9]{64}$/i.test(hash)) {
        cache.set('history-hash', hash);
        return hash;
      }
    }
  } catch {
    // Ignore
  }

  const envHash = process.env.NEXT_PUBLIC_HISTORY_INDEX_HASH || '';
  if (envHash) {
    cache.set('history-hash', envHash);
  }
  return envHash;
}

async function fetchHistoryIndex(): Promise<HistoryIndex | null> {
  const cached = cache.get<HistoryIndex>('history-index', HISTORY_INDEX_CACHE_TTL);
  if (cached) return cached;

  const hash = await getHistoryHash();
  if (!hash) return null;

  try {
    const response = await fetch(`${ALEPH_STORAGE_URL}${hash}`, {
      cache: 'no-store',
    });
    if (!response.ok) return null;

    const data = await response.json() as HistoryIndex;
    cache.set('history-index', data);
    return data;
  } catch {
    return null;
  }
}

function generateHistoryId(project: string, stablecoin: string, chain: string): string {
  const chainSlug = chain.toLowerCase().replace(/\s+/g, '-');
  return `${project}-${stablecoin.toLowerCase()}-${chainSlug}`;
}

export async function fetchPoolHistory(poolId: string): Promise<PoolHistoryData | null> {
  const cacheKey = `pool-history-${poolId}`;
  const cached = cache.get<PoolHistoryData>(cacheKey, HISTORY_INDEX_CACHE_TTL);
  if (cached) return cached;

  const index = await fetchHistoryIndex();
  if (!index) return null;

  const poolEntry = index.pools[poolId];
  if (!poolEntry) return null;

  try {
    const response = await fetch(`${ALEPH_STORAGE_URL}${poolEntry.hash}`, {
      cache: 'no-store',
    });
    if (!response.ok) return null;

    const data = await response.json() as PoolHistoryData;
    cache.set(cacheKey, data);
    return data;
  } catch {
    return null;
  }
}

// ============================================
// POOL DATA FETCHING
// ============================================

/**
 * Fetch pools from DefiLlama API (returns raw DefiLlamaPool format)
 */
async function fetchDefiLlamaPools(): Promise<DefiLlamaPool[]> {
  try {
    const response = await fetch(DEFILLAMA_API_URL, {
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('Failed to fetch from DefiLlama');

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching DefiLlama pools:', error);
    return [];
  }
}

/**
 * Apply whitelist filters to DefiLlama pools
 */
function applyWhitelist(pools: DefiLlamaPool[]): DefiLlamaPool[] {
  const whitelistedProtocols = Object.keys(YIIELD_PROTOCOLS);

  return pools.filter((pool) => {
    if (!whitelistedProtocols.includes(pool.project)) return false;
    if (!pool.stablecoin) return false;
    if (pool.tvlUsd < 100000) return false;
    if (pool.apy <= 0 || pool.apy > 50) return false;
    return true;
  });
}

/**
 * Calculate security score for a DefiLlama pool
 */
function calculateSecurityScore(pool: DefiLlamaPool): number {
  const protocol = PROTOCOL_LOOKUP[pool.project];
  if (!protocol) return 0;

  let score = 0;

  // Audit score (max 25 points)
  score += Math.min(protocol.audits * 5, 25);

  // Protocol age (max 25 points)
  if (protocol.launchYear) {
    const age = new Date().getFullYear() - protocol.launchYear;
    score += Math.min(age * 5, 25);
  }

  // TVL score (max 25 points)
  const tvlBillions = pool.tvlUsd / 1_000_000_000;
  if (tvlBillions >= 10) score += 25;
  else if (tvlBillions >= 5) score += 20;
  else if (tvlBillions >= 1) score += 15;
  else if (tvlBillions >= 0.5) score += 10;
  else if (tvlBillions >= 0.1) score += 5;

  // Exploit score (max 25 points)
  const exploits = protocol.exploits || 0;
  if (exploits === 0) score += 25;
  else if (exploits === 1) score += 15;
  else if (exploits === 2) score += 5;

  return Math.min(score, 100);
}

/**
 * Calculate Yiield score (enhanced with bonuses)
 */
function calculateYiieldScore(pool: DefiLlamaPool, baseScore: number): number {
  const protocol = YIIELD_PROTOCOLS[pool.project];
  if (!protocol) return baseScore;

  let bonusPoints = 0;

  // Tier-1 auditor bonus (+10 points)
  const tier1Auditors = ['OpenZeppelin', 'Trail of Bits', 'Consensys Diligence', 'ChainSecurity', 'Certora'];
  const hasTier1Audit = protocol.auditors?.some((audit) =>
    tier1Auditors.some((auditor) => audit.name.includes(auditor))
  );
  if (hasTier1Audit) bonusPoints += 10;

  // Doxxed team bonus (+5 points)
  if (protocol.teamStatus === 'doxxed') bonusPoints += 5;

  // Insurance bonus (+3 points)
  if (protocol.insurance) bonusPoints += 3;

  // DAO governance bonus (+2 points)
  if (protocol.governance?.governanceType === 'dao') bonusPoints += 2;

  return Math.min(baseScore + bonusPoints, 100);
}

/**
 * Transform DefiLlamaPool to simpler API format
 */
function transformToApiFormat(pool: DefiLlamaPool, securityScore: number, yiieldScore: number) {
  const protocol = PROTOCOL_LOOKUP[pool.project] || { name: pool.project };

  return {
    // Use DefiLlamaPool properties directly
    pool: pool.pool,
    project: pool.project,
    chain: pool.chain,
    symbol: pool.symbol,
    tvlUsd: pool.tvlUsd,
    apy: pool.apy,
    apyBase: pool.apyBase,
    apyReward: pool.apyReward,
    poolMeta: pool.poolMeta,
    // Add computed scores
    securityScore,
    yiieldScore,
    // Add protocol name
    projectName: protocol.name,
    projectType: protocol.type,
  };
}

/**
 * Main function to fetch all pools
 */
export async function fetchAllPools() {
  const cacheKey = 'all-pools';
  const cached = cache.get<any[]>(cacheKey, POOLS_CACHE_TTL);
  if (cached) return cached;

  // Fetch from DefiLlama
  const defiLlamaPools = await fetchDefiLlamaPools();

  // Apply whitelist
  const filteredPools = applyWhitelist(defiLlamaPools);

  // Calculate scores and transform
  const enrichedPools = filteredPools.map((pool) => {
    const securityScore = calculateSecurityScore(pool);
    const yiieldScore = calculateYiieldScore(pool, securityScore);
    return transformToApiFormat(pool, securityScore, yiieldScore);
  });

  // Filter by minimum security score
  const finalPools = enrichedPools.filter((pool) => pool.securityScore >= MIN_SECURITY_SCORE);

  cache.set(cacheKey, finalPools);
  return finalPools;
}

/**
 * Get pool by ID
 */
export async function getPoolById(poolId: string) {
  const pools = await fetchAllPools();
  return pools.find((pool) => pool.pool === poolId) || null;
}

/**
 * Get aggregate statistics
 */
export async function getStats() {
  const pools = await fetchAllPools();

  const totalTvl = pools.reduce((sum, pool) => sum + pool.tvlUsd, 0);
  const averageApy = pools.reduce((sum, pool) => sum + pool.apy, 0) / pools.length;
  const averageSecurityScore =
    pools.reduce((sum, pool) => sum + pool.securityScore, 0) / pools.length;

  const protocolSet = new Set(pools.map((p) => p.project));
  const chainSet = new Set(pools.map((p) => p.chain));
  const stablecoinSet = new Set(pools.map((p) => p.symbol));

  // Group by stablecoin
  const byStablecoin: Record<string, { tvl: number; avgApy: number; poolCount: number }> = {};
  for (const pool of pools) {
    if (!byStablecoin[pool.symbol]) {
      byStablecoin[pool.symbol] = { tvl: 0, avgApy: 0, poolCount: 0 };
    }
    byStablecoin[pool.symbol].tvl += pool.tvlUsd;
    byStablecoin[pool.symbol].avgApy += pool.apy;
    byStablecoin[pool.symbol].poolCount++;
  }
  for (const coin in byStablecoin) {
    byStablecoin[coin].avgApy /= byStablecoin[coin].poolCount;
  }

  // Group by chain
  const byChain: Record<string, { tvl: number; avgApy: number; poolCount: number }> = {};
  for (const pool of pools) {
    if (!byChain[pool.chain]) {
      byChain[pool.chain] = { tvl: 0, avgApy: 0, poolCount: 0 };
    }
    byChain[pool.chain].tvl += pool.tvlUsd;
    byChain[pool.chain].avgApy += pool.apy;
    byChain[pool.chain].poolCount++;
  }
  for (const chain in byChain) {
    byChain[chain].avgApy /= byChain[chain].poolCount;
  }

  return {
    totalTvl,
    averageApy,
    averageSecurityScore,
    totalPools: pools.length,
    protocolCount: protocolSet.size,
    chainCount: chainSet.size,
    stablecoinCount: stablecoinSet.size,
    byStablecoin,
    byChain,
  };
}
