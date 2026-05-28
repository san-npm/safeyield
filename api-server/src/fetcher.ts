import { YieldPool, DefiLlamaPool, MerklOpportunity, Protocol, Stats } from './types';

// Supported stablecoins
const STABLECOINS = [
  'USDC', 'USDT', 'DAI', 'FRAX', 'LUSD', 'TUSD', 'BUSD', 'GUSD', 'USDP', 'USDD',
  'PYUSD', 'FDUSD', 'EURC', 'EURS', 'EURT', 'AGEUR', 'CRVUSD', 'GHO', 'DOLA',
  'MIM', 'SUSD', 'RAI', 'FEI', 'UST', 'USTC', 'USDN', 'USDX', 'USDS', 'USDE',
  'USD0', 'USD1', 'USDG', 'EURE', 'WXDAI', 'SDAI', 'SUSDS', 'SUSDE', 'SCRVUSD',
];

// Chain ID to name mapping
const CHAIN_NAMES: Record<number, string> = {
  1: 'Ethereum',
  10: 'Optimism',
  56: 'BSC',
  100: 'Gnosis',
  137: 'Polygon',
  250: 'Fantom',
  324: 'zkSync',
  8453: 'Base',
  42161: 'Arbitrum',
  43114: 'Avalanche',
  59144: 'Linea',
  534352: 'Scroll',
};

// Cache
let poolsCache: YieldPool[] = [];
let lastFetch = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function isStablecoin(symbol: string): boolean {
  const upperSymbol = symbol.toUpperCase();
  return STABLECOINS.some(stable =>
    upperSymbol === stable ||
    upperSymbol.includes(stable) ||
    upperSymbol.startsWith(stable) ||
    upperSymbol.endsWith(stable)
  );
}

function extractStablecoin(symbol: string): string {
  const upperSymbol = symbol.toUpperCase();
  for (const stable of STABLECOINS) {
    if (upperSymbol === stable || upperSymbol.includes(stable)) {
      return stable;
    }
  }
  return symbol;
}

function calculateSecurityScore(protocol: string, tvl: number): number {
  // Simplified security scoring based on TVL and known protocols
  const trustedProtocols = ['aave', 'compound', 'maker', 'curve', 'convex', 'lido', 'morpho', 'spark'];
  const isKnown = trustedProtocols.some(p => protocol.toLowerCase().includes(p));

  let score = 50;

  // TVL bonus (up to 25 points)
  if (tvl > 1_000_000_000) score += 25;
  else if (tvl > 100_000_000) score += 20;
  else if (tvl > 10_000_000) score += 15;
  else if (tvl > 1_000_000) score += 10;
  else score += 5;

  // Known protocol bonus
  if (isKnown) score += 20;

  return Math.min(100, score);
}

async function fetchDefiLlama(): Promise<DefiLlamaPool[]> {
  try {
    const response = await fetch('https://yields.llama.fi/pools');
    if (!response.ok) throw new Error(`DefiLlama API error: ${response.status}`);
    const data = await response.json() as { data: DefiLlamaPool[] };
    return data.data || [];
  } catch (error) {
    console.error('DefiLlama fetch error:', error);
    return [];
  }
}

async function fetchMerklRewards(): Promise<Map<string, number>> {
  const merklMap = new Map<string, number>();

  try {
    const chainIds = [1, 10, 137, 8453, 42161];

    await Promise.all(chainIds.map(async (chainId) => {
      try {
        const response = await fetch(`https://api.merkl.xyz/v4/opportunities?chainId=${chainId}`);
        if (!response.ok) return;

        const opportunities = await response.json() as MerklOpportunity[];

        for (const opp of opportunities) {
          if (opp.apr > 0 && opp.protocol?.id) {
            const key = `${opp.protocol.id.toLowerCase()}-${CHAIN_NAMES[chainId]?.toLowerCase() || chainId}`;
            const existing = merklMap.get(key) || 0;
            merklMap.set(key, Math.max(existing, opp.apr));
          }
        }
      } catch {
        // Ignore individual chain errors
      }
    }));
  } catch (error) {
    console.error('Merkl fetch error:', error);
  }

  return merklMap;
}

export async function fetchAllPools(): Promise<YieldPool[]> {
  // Return cache if fresh
  if (poolsCache.length > 0 && Date.now() - lastFetch < CACHE_TTL) {
    return poolsCache;
  }

  console.log('Fetching fresh data from APIs...');

  const [defiLlamaPools, merklRewards] = await Promise.all([
    fetchDefiLlama(),
    fetchMerklRewards(),
  ]);

  const pools: YieldPool[] = [];

  for (const pool of defiLlamaPools) {
    // Filter for stablecoin pools only
    if (!pool.stablecoin && !isStablecoin(pool.symbol)) continue;

    // Skip very small pools
    if (pool.tvlUsd < 10000) continue;

    // Skip pools with no APY
    if (!pool.apy || pool.apy <= 0) continue;

    // Skip suspiciously high APY (likely errors or scams)
    if (pool.apy > 100) continue;

    const stablecoin = extractStablecoin(pool.symbol);
    const securityScore = calculateSecurityScore(pool.project, pool.tvlUsd);

    // Check for Merkl rewards
    const merklKey = `${pool.project.toLowerCase()}-${pool.chain.toLowerCase()}`;
    const merklApr = merklRewards.get(merklKey) || 0;

    const yieldPool: YieldPool = {
      id: pool.pool,
      protocol: pool.project,
      chain: pool.chain,
      symbol: pool.symbol,
      stablecoin,
      apy: pool.apy + merklApr,
      apyBase: pool.apyBase || pool.apy,
      apyReward: (pool.apyReward || 0) + merklApr,
      merklRewardApr: merklApr > 0 ? merklApr : undefined,
      tvl: pool.tvlUsd,
      securityScore,
      yiieldScore: Math.round((pool.apy * 0.4 + securityScore * 0.6)),
    };

    pools.push(yieldPool);
  }

  // Sort by TVL descending
  pools.sort((a, b) => b.tvl - a.tvl);

  // Update cache
  poolsCache = pools;
  lastFetch = Date.now();

  console.log(`Fetched ${pools.length} stablecoin pools`);
  return pools;
}

export async function getProtocols(): Promise<Protocol[]> {
  const pools = await fetchAllPools();
  const protocolMap = new Map<string, Protocol>();

  for (const pool of pools) {
    const slug = pool.protocol.toLowerCase().replace(/\s+/g, '-');
    const existing = protocolMap.get(slug);

    if (existing) {
      existing.poolCount++;
      existing.totalTvl += pool.tvl;
      existing.avgApy = (existing.avgApy * (existing.poolCount - 1) + pool.apy) / existing.poolCount;
      if (!existing.chains.includes(pool.chain)) {
        existing.chains.push(pool.chain);
      }
    } else {
      protocolMap.set(slug, {
        slug,
        name: pool.protocol,
        poolCount: 1,
        totalTvl: pool.tvl,
        avgApy: pool.apy,
        chains: [pool.chain],
        securityScore: pool.securityScore,
      });
    }
  }

  return Array.from(protocolMap.values()).sort((a, b) => b.totalTvl - a.totalTvl);
}

export async function getStats(): Promise<Stats> {
  const pools = await fetchAllPools();
  const protocols = new Set(pools.map(p => p.protocol));
  const chains = new Set(pools.map(p => p.chain));

  const totalTvl = pools.reduce((sum, p) => sum + p.tvl, 0);
  const avgApy = pools.length > 0 ? pools.reduce((sum, p) => sum + p.apy, 0) / pools.length : 0;
  const topApy = pools.length > 0 ? Math.max(...pools.map(p => p.apy)) : 0;

  return {
    totalPools: pools.length,
    totalTvl,
    avgApy: Math.round(avgApy * 100) / 100,
    topApy: Math.round(topApy * 100) / 100,
    protocolCount: protocols.size,
    chainCount: chains.size,
    lastUpdated: new Date().toISOString(),
  };
}
