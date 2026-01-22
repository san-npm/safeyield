// ============================================
// Custom Protocol Fetchers
// Ported from customProtocolsApi.ts for collector
// ============================================

import { PoolData } from '../types.js';

// ============================================
// Type definitions for API responses
// ============================================

interface KaminoReserve {
  liquidityToken: string;
  supplyApy: string;
  totalSupplyUsd: string;
}

interface MorphoVault {
  address: string;
  name: string;
  symbol: string;
  avgApy: number;
  totalAssetsUsd: number;
  asset: { address: string; symbol: string } | null;
  chain: { id: number; network: string } | null;
}

interface MorphoResponse {
  data: {
    vaultV2s: {
      items: MorphoVault[];
    };
  };
}

interface FluidToken {
  asset: {
    symbol: string;
    decimals: number;
    price: string;
  } | null;
  supplyRate: string;
  totalAssets: string;
}

interface FluidResponse {
  data: FluidToken[];
}

interface JupiterToken {
  asset: {
    symbol: string;
    decimals: number;
    price: string;
  } | null;
  supplyRate: string;
  rewardsRate: string;
  totalRate: string;
  totalAssets: string;
}

interface AaveMarket {
  name: string;
  chain: { name: string; chainId: number };
  reserves: AaveReserve[];
}

interface AaveReserve {
  underlyingToken: { symbol: string };
  supplyInfo: { apy: { value: string } } | null;
  size: { usd: string } | null;
}

interface AaveResponse {
  data: { markets: AaveMarket[] };
  errors?: unknown[];
}

interface VenusMarket {
  address: string;
  underlyingSymbol: string;
  symbol: string;
  supplyApy: string;
  totalSupplyUnderlyingCents: string;
  poolComptrollerAddress: string;
}

interface VenusResponse {
  result: VenusMarket[];
}

interface CapMetrics {
  suppliedUSD: string;
  interestRate: string;
}

// ============================================
// KAMINO FINANCE (Solana)
// ============================================

export async function fetchKaminoPools(): Promise<PoolData[]> {
  try {
    const mainMarket = '7u3HeHxYDLhnCoErrtycNokbQYbWGzLs6JSDqGAv5PfF';
    const response = await fetch(`https://api.kamino.finance/kamino-market/${mainMarket}/reserves/metrics`);

    if (!response.ok) {
      throw new Error(`Kamino API error: ${response.status}`);
    }

    const data = await response.json() as KaminoReserve[];
    const pools: PoolData[] = [];
    const supportedStablecoins = ['USDC', 'USDT', 'USDS', 'USDG'];

    for (const reserve of data) {
      const token = reserve.liquidityToken;
      if (supportedStablecoins.includes(token)) {
        const apyDecimal = parseFloat(reserve.supplyApy || '0');
        const apy = apyDecimal * 100;
        const tvl = parseFloat(reserve.totalSupplyUsd || '0');

        pools.push({
          id: `kamino-${token.toLowerCase()}-solana`,
          protocol: 'Kamino',
          chain: 'Solana',
          symbol: token,
          stablecoin: token,
          apy,
          apyBase: apy,
          apyReward: 0,
          tvl,
          poolUrl: 'https://app.kamino.finance/lending',
        });
      }
    }

    return pools;
  } catch (error) {
    console.error('❌ Kamino API error:', error);
    return [];
  }
}

// ============================================
// MORPHO / STEAKHOUSE
// ============================================

export async function fetchMorphoPools(): Promise<PoolData[]> {
  try {
    const query = `
      query {
        vaultV2s(first: 100, where: { whitelisted: true }) {
          items {
            address
            name
            symbol
            avgApy
            totalAssetsUsd
            asset {
              address
              symbol
            }
            chain {
              id
              network
            }
          }
        }
      }
    `;

    const response = await fetch('https://blue-api.morpho.org/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`Morpho API error: ${response.status}`);
    }

    const result = await response.json() as MorphoResponse;
    const pools: PoolData[] = [];
    const supportedStablecoins = ['USDC', 'USDT', 'DAI', 'PYUSD', 'USDS', 'USDe'];

    const chainMap: Record<string, string> = {
      'ethereum': 'Ethereum',
      'base': 'Base',
      'arbitrum': 'Arbitrum',
    };

    if (result.data?.vaultV2s?.items) {
      for (const vault of result.data.vaultV2s.items) {
        if (vault.asset?.symbol) {
          const assetSymbol = vault.asset.symbol.toUpperCase();
          if (supportedStablecoins.includes(assetSymbol)) {
            const apy = (vault.avgApy || 0) * 100;
            const tvl = vault.totalAssetsUsd || 0;
            const chain = vault.chain?.network || 'Ethereum';

            pools.push({
              id: `morpho-${vault.address.toLowerCase()}`,
              protocol: 'Morpho',
              chain: chainMap[chain.toLowerCase()] || chain,
              symbol: assetSymbol,
              stablecoin: assetSymbol,
              apy,
              apyBase: apy,
              apyReward: 0,
              tvl,
              poolUrl: `https://app.morpho.org/vault?id=${vault.address}&network=${chain}`,
            });
          }
        }
      }
    }

    return pools;
  } catch (error) {
    console.error('❌ Morpho API error:', error);
    return [];
  }
}

// ============================================
// FLUID PROTOCOL
// ============================================

export async function fetchFluidPools(): Promise<PoolData[]> {
  try {
    const pools: PoolData[] = [];
    const chains = [
      { chainId: 1, name: 'Ethereum' },
      { chainId: 9745, name: 'Plasma' },
    ];
    const supportedStablecoins = ['USDC', 'USDT', 'DAI', 'USDe', 'USDS'];

    for (const chain of chains) {
      try {
        const response = await fetch(`https://api.fluid.instadapp.io/v2/lending/${chain.chainId}/tokens`);
        if (!response.ok) continue;

        const result = await response.json() as FluidResponse;
        if (result?.data) {
          for (const token of result.data) {
            let symbol = token.asset?.symbol?.toUpperCase() || '';
            if (symbol === 'USDT0') symbol = 'USDT';

            if (supportedStablecoins.includes(symbol)) {
              const apy = parseFloat(token.supplyRate || '0') / 100;
              const totalAssets = parseFloat(token.totalAssets || '0');
              const assetPrice = parseFloat(token.asset?.price || '1');
              const decimals = token.asset?.decimals || 6;
              const tvl = (totalAssets * assetPrice) / Math.pow(10, decimals);

              if (tvl === 0 || apy === 0) continue;

              pools.push({
                id: `fluid-${symbol.toLowerCase()}-${chain.name.toLowerCase()}`,
                protocol: 'Fluid',
                chain: chain.name,
                symbol,
                stablecoin: symbol,
                apy,
                apyBase: apy,
                apyReward: 0,
                tvl,
                poolUrl: 'https://fluid.instadapp.io/',
              });
            }
          }
        }
      } catch (chainError) {
        console.error(`❌ Fluid API error for ${chain.name}:`, chainError);
      }
    }

    return pools;
  } catch (error) {
    console.error('❌ Fluid API error:', error);
    return [];
  }
}

// ============================================
// JUPITER LEND (Solana)
// ============================================

export async function fetchJupiterPools(): Promise<PoolData[]> {
  try {
    const response = await fetch('https://lite-api.jup.ag/lend/v1/earn/tokens');
    if (!response.ok) {
      throw new Error(`Jupiter Lend API error: ${response.status}`);
    }

    const data = await response.json() as JupiterToken[];
    const pools: PoolData[] = [];
    const supportedStablecoins = ['USDC', 'USDT'];

    for (const token of data) {
      const symbol = token.asset?.symbol?.toUpperCase() || '';
      if (supportedStablecoins.includes(symbol)) {
        const apy = parseFloat(token.totalRate || '0') / 100;
        const totalAssets = parseFloat(token.totalAssets || '0');
        const assetPrice = parseFloat(token.asset?.price || '1');
        const decimals = token.asset?.decimals || 6;
        const tvl = (totalAssets * assetPrice) / Math.pow(10, decimals);

        pools.push({
          id: `jupiter-${symbol.toLowerCase()}-solana`,
          protocol: 'Jupiter Lend',
          chain: 'Solana',
          symbol,
          stablecoin: symbol,
          apy,
          apyBase: parseFloat(token.supplyRate || '0') / 100,
          apyReward: parseFloat(token.rewardsRate || '0') / 100,
          tvl,
          poolUrl: 'https://jup.ag/lend/earn',
        });
      }
    }

    return pools;
  } catch (error) {
    console.error('❌ Jupiter Lend API error:', error);
    return [];
  }
}

// ============================================
// AAVE V3
// ============================================

export async function fetchAavePools(): Promise<PoolData[]> {
  const query = `
    query Markets($request: MarketInput!) {
      markets(request: $request) {
        name
        chain {
          name
          chainId
        }
        reserves {
          underlyingToken {
            symbol
            name
            decimals
            address
          }
          supplyInfo {
            apy {
              value
            }
          }
          size {
            usd
          }
        }
      }
    }
  `;

  // Excluded: Celo (42220), Sonic (146), zkSync (324), Scroll (534352), Soneium (1868)
  const mainnetChainIds = [1, 42161, 43114, 8453, 56, 100, 59144, 1088, 10, 137, 9745];
  const variables = { request: { chainIds: mainnetChainIds } };

  try {
    const response = await fetch('https://api.v3.aave.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    });

    const result = await response.json() as AaveResponse;
    if (result.errors) {
      console.error('❌ Aave GraphQL error:', result.errors);
      return [];
    }

    const pools: PoolData[] = [];
    const stablecoins = ['USDC', 'USDT', 'DAI', 'USDS', 'PYUSD', 'USDe', 'USD1', 'USDG', 'EURe', 'EURC'];

    // Excluded: Celo, Sonic, zkSync, Scroll, Soneium
    const chainMap: Record<number, string> = {
      1: 'Ethereum', 42161: 'Arbitrum', 43114: 'Avalanche', 8453: 'Base',
      56: 'BSC', 100: 'Gnosis', 59144: 'Linea', 1088: 'Metis',
      10: 'Optimism', 137: 'Polygon', 9745: 'Plasma'
    };

    result.data.markets.forEach((market: AaveMarket) => {
      const chainId = market.chain.chainId;
      const chainName = chainMap[chainId] || market.chain.name;

      market.reserves.forEach((reserve: AaveReserve) => {
        const symbol = reserve.underlyingToken.symbol;
        if (!stablecoins.includes(symbol)) return;

        const apy = parseFloat(reserve.supplyInfo?.apy?.value || '0') * 100;
        const tvl = parseFloat(reserve.size?.usd || '0');

        if (apy === 0 || tvl === 0) return;

        pools.push({
          id: `aave-v3-${symbol.toLowerCase()}-${chainName.toLowerCase().replace(/\s+/g, '-')}`,
          protocol: 'Aave V3',
          chain: chainName,
          stablecoin: symbol,
          symbol,
          apy,
          tvl,
          poolUrl: 'https://app.aave.com/',
        });
      });
    });

    return pools;
  } catch (error) {
    console.error('❌ Aave GraphQL API error:', error);
    return [];
  }
}

// ============================================
// VENUS PROTOCOL (BSC)
// ============================================

export async function fetchVenusPools(): Promise<PoolData[]> {
  try {
    const response = await fetch('https://api.venus.io/markets?chainId=56&limit=100&page=0', {
      headers: {
        'accept-version': 'stable',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`❌ Venus API error: ${response.status}`);
      return [];
    }

    const data = await response.json() as VenusResponse;
    const markets = data.result || [];
    const pools: PoolData[] = [];
    const stablecoins = ['USDC', 'USDT', 'DAI', 'USD1'];

    markets.forEach((market: VenusMarket) => {
      const symbol = market.underlyingSymbol?.toUpperCase() || '';
      const vTokenSymbol = market.symbol?.toUpperCase() || '';

      if (!stablecoins.includes(symbol)) return;
      if (vTokenSymbol.includes('_')) return; // Skip secondary pools

      const supplyApy = parseFloat(market.supplyApy || '0');
      const tvl = parseFloat(market.totalSupplyUnderlyingCents || '0') / 100;

      if (tvl < 100000 || supplyApy <= 0 || supplyApy > 100) return;

      pools.push({
        id: `venus-${market.address}`,
        protocol: 'Venus',
        chain: 'BSC',
        symbol,
        stablecoin: symbol,
        apy: supplyApy,
        apyBase: supplyApy,
        apyReward: 0,
        tvl,
        poolUrl: `https://app.venus.io/#/pool/${market.poolComptrollerAddress}/market/${market.address}?chainId=56&tab=supply`,
      });
    });

    return pools;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Venus API error:', errorMessage);
    return [];
  }
}

// ============================================
// CAP MONEY (Ethereum)
// ============================================

export async function fetchCapPools(): Promise<PoolData[]> {
  try {
    const pools: PoolData[] = [];
    const networkMap: Record<number, string> = { 1: 'Ethereum' };
    const networks = [1];
    const stablecoins = ['USDC'];

    for (const networkId of networks) {
      for (const tokenSymbol of stablecoins) {
        try {
          const metricsResponse = await fetch(
            `https://api.cap.app/v1/lender/${networkId}/metrics/${tokenSymbol}`
          );
          if (!metricsResponse.ok) continue;

          const metrics = await metricsResponse.json() as CapMetrics;
          const tvl = parseFloat(metrics.suppliedUSD || '0');
          if (tvl < 100000) continue;

          const apy = parseFloat(metrics.interestRate || '0') * 100;
          if (apy < 0.1) continue;

          const chainName = networkMap[networkId] || 'Ethereum';

          pools.push({
            id: `cap-${tokenSymbol.toLowerCase()}-${chainName.toLowerCase()}`,
            protocol: 'Cap Money',
            chain: chainName,
            symbol: tokenSymbol,
            stablecoin: tokenSymbol,
            apy,
            apyBase: apy,
            apyReward: 0,
            tvl,
            poolUrl: `https://cap.app/asset/${networkId}/${tokenSymbol}`,
          });
        } catch {
          continue;
        }
      }
    }

    return pools;
  } catch (error) {
    console.error('❌ Cap Money API error:', error);
    return [];
  }
}

// ============================================
// HYPERLIQUID PROTOCOLS
// ============================================

// Felix Protocol - Hyperliquid L1 lending
export async function fetchFelixPools(): Promise<PoolData[]> {
  try {
    const response = await fetch('https://yields.llama.fi/pools');
    if (!response.ok) {
      throw new Error(`DefiLlama API error: ${response.status}`);
    }

    const json = await response.json();
    const pools: PoolData[] = [];
    const supportedStablecoins = ['USDC', 'USDT'];

    for (const pool of json.data || []) {
      if (pool.project === 'felix' && pool.chain === 'Hyperliquid') {
        const symbol = pool.symbol?.toUpperCase()?.split('-')[0] || '';
        if (supportedStablecoins.includes(symbol)) {
          pools.push({
            id: `felix-${symbol.toLowerCase()}-hyperliquid`,
            protocol: 'Felix',
            chain: 'Hyperliquid',
            symbol: symbol,
            stablecoin: symbol,
            apy: pool.apy || 0,
            apyBase: pool.apyBase || pool.apy || 0,
            apyReward: pool.apyReward || 0,
            tvl: pool.tvlUsd || 0,
            poolUrl: 'https://usefelix.xyz/',
          });
        }
      }
    }

    return pools;
  } catch (error) {
    console.error('❌ Felix API error:', error);
    return [];
  }
}

// HyperLend - Hyperliquid L1 lending protocol
export async function fetchHyperLendPools(): Promise<PoolData[]> {
  try {
    const response = await fetch('https://yields.llama.fi/pools');
    if (!response.ok) return [];

    const json = await response.json();
    const pools: PoolData[] = [];
    const supportedStablecoins = ['USDC', 'USDT'];

    for (const pool of json.data || []) {
      if (pool.project === 'hyperlend' && pool.chain === 'Hyperliquid') {
        const symbol = pool.symbol?.toUpperCase()?.split('-')[0] || '';
        if (supportedStablecoins.includes(symbol)) {
          pools.push({
            id: `hyperlend-${symbol.toLowerCase()}-hyperliquid`,
            protocol: 'HyperLend',
            chain: 'Hyperliquid',
            symbol: symbol,
            stablecoin: symbol,
            apy: pool.apy || 0,
            apyBase: pool.apyBase || pool.apy || 0,
            apyReward: pool.apyReward || 0,
            tvl: pool.tvlUsd || 0,
            poolUrl: 'https://app.hyperlend.finance/',
          });
        }
      }
    }

    return pools;
  } catch (error) {
    console.error('❌ HyperLend API error:', error);
    return [];
  }
}

// HyperBeat - Hyperliquid yield optimizer
export async function fetchHyperBeatPools(): Promise<PoolData[]> {
  try {
    const response = await fetch('https://yields.llama.fi/pools');
    if (!response.ok) {
      throw new Error(`DefiLlama API error: ${response.status}`);
    }

    const json = await response.json();
    const pools: PoolData[] = [];
    const supportedStablecoins = ['USDC', 'USDT'];

    for (const pool of json.data || []) {
      if (pool.project === 'hyperbeat' && pool.chain === 'Hyperliquid') {
        const symbol = pool.symbol?.toUpperCase()?.split('-')[0] || '';
        if (supportedStablecoins.includes(symbol)) {
          pools.push({
            id: `hyperbeat-${symbol.toLowerCase()}-hyperliquid`,
            protocol: 'HyperBeat',
            chain: 'Hyperliquid',
            symbol: symbol,
            stablecoin: symbol,
            apy: pool.apy || 0,
            apyBase: pool.apyBase || pool.apy || 0,
            apyReward: pool.apyReward || 0,
            tvl: pool.tvlUsd || 0,
            poolUrl: 'https://hyperbeat.org/',
          });
        }
      }
    }

    return pools;
  } catch (error) {
    console.error('❌ HyperBeat API error:', error);
    return [];
  }
}

// ============================================
// FETCH ALL CUSTOM POOLS
// ============================================

export async function fetchAllCustomPools(): Promise<PoolData[]> {
  console.log('🔄 Fetching custom protocol pools...');

  const results = await Promise.allSettled([
    fetchKaminoPools(),
    fetchMorphoPools(),
    fetchFluidPools(),
    fetchJupiterPools(),
    fetchVenusPools(),
    fetchCapPools(),
    fetchAavePools(),
    // Hyperliquid protocols
    fetchFelixPools(),
    fetchHyperLendPools(),
    fetchHyperBeatPools(),
  ]);

  const allPools: PoolData[] = [];
  const protocolNames = ['Kamino', 'Morpho', 'Fluid', 'Jupiter Lend', 'Venus', 'Cap Money', 'Aave V3', 'Felix', 'HyperLend', 'HyperBeat'];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      allPools.push(...result.value);
      console.log(`✅ ${protocolNames[index]}: ${result.value.length} pools`);
    } else {
      console.error(`❌ ${protocolNames[index]}: ${result.reason}`);
    }
  });

  console.log(`✅ Total custom pools: ${allPools.length}`);
  return allPools;
}
