// ============================================
// 🔌 APIs PERSONNALISÉES POUR PROTOCOLES NON-DEFILLAMA
// ============================================

import { YieldPool } from '@/types';

// ============================================
// CONFIGURATION DES INCENTIVES EXTERNES
// ============================================

// Protocoles avec incentives externes (Merkl, etc.) non capturées dans l'APY de base
// Source: https://merkl.xyz/ - Plateforme d'incentives utilisée par 200+ protocoles
export interface ExternalIncentiveConfig {
  protocol: string;
  stablecoins?: string[]; // Si vide, s'applique à tous les stablecoins du protocole
  incentivePlatform: 'Merkl' | 'Other';
  incentivePlatformUrl: string;
  note: {
    en: string;
    fr: string;
  };
}

export const EXTERNAL_INCENTIVES: ExternalIncentiveConfig[] = [
  {
    protocol: 'Aave',
    stablecoins: ['USDG'], // USDG a ~5.92% de rewards Merkl en plus du base APY
    incentivePlatform: 'Merkl',
    incentivePlatformUrl: 'https://merkl.xyz/',
    note: {
      en: 'Additional Merkl rewards are available but not included in the displayed APY. Check Merkl for current incentive rates.',
      fr: 'Des récompenses Merkl additionnelles sont disponibles mais non incluses dans l\'APY affiché. Consultez Merkl pour les taux d\'incentives actuels.',
    },
  },
  {
    protocol: 'Morpho',
    incentivePlatform: 'Merkl',
    incentivePlatformUrl: 'https://merkl.xyz/',
    note: {
      en: 'This protocol may offer additional Merkl incentives not reflected in the APY.',
      fr: 'Ce protocole peut offrir des incentives Merkl supplémentaires non reflétés dans l\'APY.',
    },
  },
  {
    protocol: 'Euler',
    incentivePlatform: 'Merkl',
    incentivePlatformUrl: 'https://merkl.xyz/',
    note: {
      en: 'This protocol may offer additional Merkl incentives not reflected in the APY.',
      fr: 'Ce protocole peut offrir des incentives Merkl supplémentaires non reflétés dans l\'APY.',
    },
  },
];

// Helper function pour vérifier si un pool a des incentives externes
export function hasExternalIncentives(protocol: string, stablecoin?: string): ExternalIncentiveConfig | null {
  for (const config of EXTERNAL_INCENTIVES) {
    if (config.protocol === protocol) {
      // Si aucun stablecoin spécifié dans la config, s'applique à tous
      if (!config.stablecoins || config.stablecoins.length === 0) {
        return config;
      }
      // Sinon, vérifier si le stablecoin correspond
      if (stablecoin && config.stablecoins.includes(stablecoin)) {
        return config;
      }
    }
  }
  return null;
}

// ============================================
// 1. KAMINO FINANCE (Solana)
// ============================================

interface KaminoMarket {
  reserve: {
    symbol: string;
    totalSupply: string;
    supplyApr: number;
  };
}

// Kamino Curated Vaults Configuration
// Ces vaults sont gérés par des experts (Steakhouse, Allez Labs, Sentora, Gauntlet, MEV Capital)
// et offrent généralement des APYs plus élevés que les marchés de base
// Source: https://kamino.com/lend
interface KaminoCuratedVault {
  address: string;
  name: string;
  manager: string;
  asset: 'USDC' | 'USDT' | 'USDS' | 'USDG' | 'PYUSD';
  url: string;
  // APY et TVL doivent être mis à jour manuellement ou via scraping
  // car l'API Kamino ne les expose pas via REST
}

const KAMINO_CURATED_VAULTS: KaminoCuratedVault[] = [
  {
    address: 'HDsayqAsDWy3QvANGqh2yNraqcD8Fnjgh73Mhb3WRS5E',
    name: 'USDC Prime',
    manager: 'Steakhouse',
    asset: 'USDC',
    url: 'https://kamino.com/lend/usdc-prime',
  },
  {
    address: 'A2wsxhA7pF4B2UKVfXocb6TAAP9ipfPJam6oMKgDE5BK',
    name: 'Sentora PYUSD',
    manager: 'Sentora',
    asset: 'PYUSD',
    url: 'https://kamino.com/lend/sentora-pyusd',
  },
  {
    address: 'A1USdzqDHmw5oz97AkqAGLxEQZfFjASZFuy4T6Qdvnpo',
    name: 'Allez USDC',
    manager: 'Allez Labs',
    asset: 'USDC',
    url: 'https://kamino.com/lend',
  },
  {
    address: 'BoZDRc1RDY9FzUZZ19WT4GbtTnnbXQ8AGSU5ByEw3ut5',
    name: 'USDG Vault',
    manager: 'Multiple',
    asset: 'USDG',
    url: 'https://kamino.com/lend',
  },
  {
    address: 'BqBsS4myH82S4yfqeKjXSF7yErWwSi5WTshSzKmHQgzw',
    name: 'USDG Vault 2',
    manager: 'Multiple',
    asset: 'USDG',
    url: 'https://kamino.com/lend',
  },
  {
    address: 'A1USdsC4kypCgPw5dHAwmqDjfFKrtdVHtXLhDY9QvHQ3',
    name: 'Allez USDC 2',
    manager: 'Allez Labs',
    asset: 'USDC',
    url: 'https://kamino.com/lend',
  },
  {
    address: 'A1USdT5BhSBpWiH4W6oZeykCDr9vq56qXVkMFhZjN48o',
    name: 'Allez USDC 3',
    manager: 'Allez Labs',
    asset: 'USDC',
    url: 'https://kamino.com/lend',
  },
];

export async function fetchKaminoPools(): Promise<Partial<YieldPool>[]> {
  try {
    // Kamino Main Market pubkey sur Solana
    const mainMarket = '7u3HeHxYDLhnCoErrtycNokbQYbWGzLs6JSDqGAv5PfF';
    const response = await fetch(`https://api.kamino.finance/kamino-market/${mainMarket}/reserves/metrics`);

    if (!response.ok) {
      throw new Error(`Kamino API error: ${response.status}`);
    }

    const data = await response.json();
    const pools: Partial<YieldPool>[] = [];

    // Filtrer les stablecoins supportés
    const supportedStablecoins = ['USDC', 'USDT', 'USDS', 'USDG'];

    for (const reserve of data) {
      const token = reserve.liquidityToken;

      // Vérifier si c'est un stablecoin supporté
      if (supportedStablecoins.includes(token)) {
        const apyDecimal = parseFloat(reserve.supplyApy || '0');
        const apy = apyDecimal * 100; // Convertir de decimal (0.0259) en pourcentage (2.59)
        const tvl = parseFloat(reserve.totalSupplyUsd || '0');

        pools.push({
          id: `kamino-${token.toLowerCase()}-solana`,
          protocol: 'Kamino',
          chain: 'Solana',
          symbol: token,
          stablecoin: token as any,
          apy: apy,
          apyBase: apy,
          apyReward: 0,
          tvl: tvl,
          poolUrl: 'https://app.kamino.finance/lending',
          // Note: Ce sont les APYs du marché de base
          // Des vaults curés (Steakhouse, Allez Labs, Sentora) offrent des APYs plus élevés
          // Voir KAMINO_CURATED_VAULTS pour la liste des vaults
        });
      }
    }

    return pools;
  } catch (error) {
    console.error('❌ Erreur Kamino API:', error);
    return [];
  }
}

// ============================================
// 2. MELLOW FINANCE (Ethereum)
// ============================================

interface MellowVault {
  address: string;
  symbol: string;
  apr: number;
  tvl: number;
  tokens: {
    base: string;
  };
}

export async function fetchMellowPools(): Promise<Partial<YieldPool>[]> {
  try {
    // NOTE: Mellow ne propose actuellement pas de vaults stablecoins USDC/USDT
    // Ils se concentrent sur ETH et BTC. Désactivé temporairement.
    console.warn('⚠️ Mellow: Pas de vaults stablecoins disponibles');
    return [];
  } catch (error) {
    console.error('❌ Erreur Mellow API:', error);
    return [];
  }
}

// ============================================
// 3. MORPHO / STEAKHOUSE (Ethereum)
// ============================================

// Known Morpho vault curators/managers
const MORPHO_CURATORS: Record<string, string> = {
  'steakhouse': 'Steakhouse',
  'gauntlet': 'Gauntlet',
  're7': 'Re7 Labs',
  'b.protocol': 'B.Protocol',
  'flagship': 'Flagship',
  'usual': 'Usual',
  'spark': 'Spark',
  'ionic': 'Ionic',
  'moonwell': 'Moonwell',
  'mev capital': 'MEV Capital',
  'block analitica': 'Block Analitica',
  'smokehouse': 'Smokehouse',
};

function extractCurator(vaultName: string): string | undefined {
  const lowerName = vaultName.toLowerCase();
  for (const [key, curator] of Object.entries(MORPHO_CURATORS)) {
    if (lowerName.includes(key)) {
      return curator;
    }
  }
  return undefined;
}

export async function fetchSteakhousePools(): Promise<Partial<YieldPool>[]> {
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
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`Morpho API error: ${response.status}`);
    }

    const { data } = await response.json();
    const pools: Partial<YieldPool>[] = [];

    if (data?.vaultV2s?.items) {
      // Filtrer les vaults avec stablecoins supportés
      const supportedStablecoins = ['USDC', 'USDT', 'DAI', 'PYUSD', 'USDS', 'USDe'];

      for (const vault of data.vaultV2s.items) {
        if (vault.asset?.symbol) {
          const assetSymbol = vault.asset.symbol.toUpperCase();

          // Vérifier si c'est un stablecoin supporté
          if (supportedStablecoins.includes(assetSymbol)) {
            const apyDecimal = vault.avgApy || 0;
            const apy = apyDecimal * 100; // Convertir en pourcentage
            const tvl = vault.totalAssetsUsd || 0;
            const chain = vault.chain?.network || 'Ethereum';

            // Mapper les noms de chains
            const chainMap: Record<string, string> = {
              'ethereum': 'Ethereum',
              'base': 'Base',
              'arbitrum': 'Arbitrum',
            };

            // Extract curator from vault name
            const curator = extractCurator(vault.name || '');

            pools.push({
              id: `morpho-${vault.address.toLowerCase()}`,
              protocol: 'Morpho',
              curator: curator,
              chain: chainMap[chain.toLowerCase()] || chain,
              symbol: assetSymbol,
              stablecoin: assetSymbol as any,
              apy: apy,
              apyBase: apy,
              apyReward: 0,
              tvl: tvl,
              poolUrl: `https://app.morpho.org/vault?id=${vault.address}&network=${chain}`,
            });
          }
        }
      }
    }

    return pools;
  } catch (error) {
    console.error('❌ Erreur Morpho/Steakhouse API:', error);
    return [];
  }
}

// ============================================
// 4. REALTOKEN RMM (Gnosis) - Tokenized Real Estate
// ============================================

const REALT_API_KEY = 'cf8f77bc-preprod-12a9-587d-9e2d19750b06';
const REALT_API_BASE = 'https://api.realtoken.community';

export async function fetchRealTokenPools(): Promise<Partial<YieldPool>[]> {
  try {
    const response = await fetch(`${REALT_API_BASE}/v1/token`, {
      headers: {
        'X-AUTH-REALT-TOKEN': REALT_API_KEY,
        'Content-Type': 'application/json',
        'Referer': 'https://app.yiield.xyz',
        'Origin': 'https://app.yiield.xyz',
      },
    });

    if (!response.ok) {
      console.warn(`⚠️ RealT API error: ${response.status}`);
      return [];
    }

    const tokens = await response.json();

    // Aggregate all RealT tokens into a single pool representing the RMM protocol
    // Individual tokens are real estate properties - we want to show the overall RMM yield
    let totalTvl = 0;
    let weightedApySum = 0;
    let validTokenCount = 0;

    for (const token of tokens) {
      const apy = parseFloat(token.annualPercentageYield || '0');
      if (apy <= 0 || apy > 50) continue; // Skip invalid APYs

      const totalSupply = parseFloat(token.totalTokens || '0');
      const tokenPrice = parseFloat(token.tokenPrice || '0');
      const tvl = totalSupply * tokenPrice;

      if (tvl < 1000) continue; // Skip very low TVL tokens

      totalTvl += tvl;
      weightedApySum += apy * tvl;
      validTokenCount++;
    }

    if (validTokenCount === 0 || totalTvl < 100000) {
      console.warn('⚠️ RealT RMM: No valid pools found');
      return [];
    }

    // Calculate weighted average APY
    const avgApy = weightedApySum / totalTvl;

    // Create a single aggregated pool for RealT RMM
    const pools: Partial<YieldPool>[] = [{
      id: 'realt-rmm-gnosis',
      protocol: 'RealT RMM',
      chain: 'Gnosis',
      symbol: 'USDC', // RealT yields are in USD
      stablecoin: 'USDC' as any,
      apy: avgApy,
      apyBase: avgApy,
      apyReward: 0,
      tvl: totalTvl,
      poolUrl: 'https://rmm.realtoken.network/',
      curator: 'RealT',
    }];

    console.log(`✅ RealT RMM: 1 pool (${validTokenCount} properties, TVL: $${(totalTvl/1e6).toFixed(2)}M, APY: ${avgApy.toFixed(2)}%)`);
    return pools;
  } catch (error) {
    console.error('❌ Erreur RealToken RMM API:', error);
    return [];
  }
}

// ============================================
// 5. FLUID PROTOCOL (Ethereum)
// ============================================

interface FluidToken {
  address: string;
  symbol: string;
  asset: {
    symbol: string;
    decimals: number;
    price: string;
  };
  supplyRate: string;
  totalAssets: string;
}

export async function fetchFluidPools(): Promise<Partial<YieldPool>[]> {
  try {
    const pools: Partial<YieldPool>[] = [];

    // Chains to fetch
    const chains = [
      { chainId: 1, name: 'Ethereum' },
      { chainId: 9745, name: 'Plasma' },
    ];

    // Filtrer les stablecoins supportés
    const supportedStablecoins = ['USDC', 'USDT', 'DAI', 'USDe', 'USDS'];

    for (const chain of chains) {
      try {
        const response = await fetch(`https://api.fluid.instadapp.io/v2/lending/${chain.chainId}/tokens`);

        if (!response.ok) {
          console.warn(`⚠️ Fluid API error for ${chain.name}: ${response.status}`);
          continue;
        }

        const data = await response.json();

        if (data?.data) {
          for (const token of data.data) {
            let symbol = token.asset?.symbol?.toUpperCase();

            // Handle special cases
            if (symbol === 'USDT0') {
              symbol = 'USDT'; // Map USDT0 to USDT on Plasma
            }

            if (supportedStablecoins.includes(symbol)) {
              const supplyRateDecimal = parseFloat(token.supplyRate || '0');
              const apy = supplyRateDecimal / 100; // Convertir de basis points (305) en pourcentage (3.05)

              // Calculer TVL en USD
              const totalAssets = parseFloat(token.totalAssets || '0');
              const assetPrice = parseFloat(token.asset?.price || '1');
              const decimals = token.asset?.decimals || 6;
              const tvl = (totalAssets * assetPrice) / Math.pow(10, decimals);

              // Skip if TVL or APY is 0
              if (tvl === 0 || apy === 0) {
                continue;
              }

              pools.push({
                id: `fluid-${symbol.toLowerCase()}-${chain.name.toLowerCase()}`,
                protocol: 'Fluid',
                chain: chain.name as any,
                symbol: symbol,
                stablecoin: symbol as any,
                apy: apy,
                apyBase: apy,
                apyReward: 0,
                tvl: tvl,
                poolUrl: 'https://fluid.instadapp.io/',
              });
            }
          }
        }
      } catch (chainError) {
        console.error(`❌ Erreur Fluid API pour ${chain.name}:`, chainError);
      }
    }

    return pools;
  } catch (error) {
    console.error('❌ Erreur Fluid API:', error);
    return [];
  }
}

// ============================================
// 6. JUPITER LEND (Solana)
// ============================================

interface JupiterToken {
  id: number;
  address: string;
  symbol: string;
  asset: {
    symbol: string;
    decimals: number;
    price: string;
  };
  supplyRate: string;
  rewardsRate: string;
  totalRate: string;
  totalAssets: string;
}

export async function fetchJupiterPools(): Promise<Partial<YieldPool>[]> {
  try {
    const response = await fetch('https://lite-api.jup.ag/lend/v1/earn/tokens');

    if (!response.ok) {
      throw new Error(`Jupiter Lend API error: ${response.status}`);
    }

    const data: JupiterToken[] = await response.json();
    const pools: Partial<YieldPool>[] = [];

    // Filtrer les stablecoins supportés
    const supportedStablecoins = ['USDC', 'USDT'];

    for (const token of data) {
      const symbol = token.asset?.symbol?.toUpperCase();

      if (supportedStablecoins.includes(symbol)) {
        // totalRate est en basis points, convertir en pourcentage
        const totalRateDecimal = parseFloat(token.totalRate || '0');
        const apy = totalRateDecimal / 100; // Convertir de basis points (444) en pourcentage (4.44)

        // Calculer TVL en USD
        const totalAssets = parseFloat(token.totalAssets || '0');
        const assetPrice = parseFloat(token.asset?.price || '1');
        const decimals = token.asset?.decimals || 6;
        const tvl = (totalAssets * assetPrice) / Math.pow(10, decimals);

        pools.push({
          id: `jupiter-${symbol.toLowerCase()}-solana`,
          protocol: 'Jupiter Lend',
          chain: 'Solana',
          symbol: symbol,
          stablecoin: symbol as any,
          apy: apy,
          apyBase: parseFloat(token.supplyRate || '0') / 100,
          apyReward: parseFloat(token.rewardsRate || '0') / 100,
          tvl: tvl,
          poolUrl: 'https://jup.ag/lend/earn',
        });
      }
    }

    return pools;
  } catch (error) {
    console.error('❌ Erreur Jupiter Lend API:', error);
    return [];
  }
}

// ============================================
// AAVE V3 - GraphQL API
// ============================================

export async function fetchAavePools(): Promise<Partial<YieldPool>[]> {
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

  // Main chains (exclude testnets, Ink, and removed chains: Celo, Sonic, zkSync, Scroll, Soneium)
  const mainnetChainIds = [1, 42161, 43114, 8453, 56, 100, 59144, 1088, 10, 137, 9745];

  const variables = {
    request: {
      chainIds: mainnetChainIds
    }
  };

  try {
    const response = await fetch('https://api.v3.aave.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });

    const data = await response.json();

    if (data.errors) {
      console.error('❌ Erreur Aave GraphQL:', data.errors);
      return [];
    }

    const pools: Partial<YieldPool>[] = [];
    // Only include stablecoins that match StablecoinType
    const stablecoins = ['USDC', 'USDT', 'DAI', 'USDS', 'PYUSD', 'USDe', 'USD1', 'USDG', 'EURe', 'EURC'];

    // Map chain IDs to chain names (excluded: Celo, Sonic, zkSync, Scroll, Soneium)
    const chainMap: Record<number, string> = {
      1: 'Ethereum',
      42161: 'Arbitrum',
      43114: 'Avalanche',
      8453: 'Base',
      56: 'BSC',
      100: 'Gnosis',
      59144: 'Linea',
      1088: 'Metis',
      10: 'Optimism',
      137: 'Polygon',
      9745: 'Plasma'
    };

    // Map market names for Aave URLs
    const marketNameMap: Record<string, string> = {
      'AaveV3Ethereum': 'proto_mainnet_v3',
      'AaveV3EthereumEtherFi': 'proto_etherfi_v3',
      'AaveV3EthereumLido': 'proto_lido_v3',
      'AaveV3EthereumHorizon': 'proto_horizon_v3',
      'AaveV3Arbitrum': 'proto_arbitrum_v3',
      'AaveV3Avalanche': 'proto_avalanche_v3',
      'AaveV3Base': 'proto_base_v3',
      'AaveV3BSC': 'proto_bnb_v3',
      'AaveV3Gnosis': 'proto_gnosis_v3',
      'AaveV3Optimism': 'proto_optimism_v3',
      'AaveV3Polygon': 'proto_polygon_v3',
      'AaveV3Metis': 'proto_metis_v3',
    };

    data.data.markets.forEach((market: any) => {
      const chainId = market.chain.chainId;
      const chainName = chainMap[chainId] || market.chain.name;
      const marketName = marketNameMap[market.name] || 'proto_mainnet_v3';

      market.reserves.forEach((reserve: any) => {
        const symbol = reserve.underlyingToken.symbol;

        // Only include stablecoins
        if (!stablecoins.includes(symbol)) {
          return;
        }

        // Aave API returns APY as decimal (0.034 = 3.4%), so multiply by 100
        // NOTE: This is the base protocol APY only, does not include external rewards (e.g., Merkl incentives)
        const apyDecimal = parseFloat(reserve.supplyInfo?.apy?.value || '0');
        const apy = apyDecimal * 100;

        // Use size.usd for total value locked
        const tvlUSD = parseFloat(reserve.size?.usd || '0');

        // Skip pools with 0 APY or 0 TVL
        if (apy === 0 || tvlUSD === 0) {
          return;
        }

        // Build Aave-specific pool URL
        // Use markets page instead of reserve-overview for better compatibility
        const poolUrl = `https://app.aave.com/markets/?marketName=${marketName}`;

        pools.push({
          id: `aave-v3-${symbol.toLowerCase()}-${chainName.toLowerCase().replace(/\s+/g, '-')}`,
          protocol: 'Aave V3',
          chain: chainName as any,
          stablecoin: symbol as any,
          apy: apy,
          tvl: tvlUSD,
          poolUrl: poolUrl,
        });
      });
    });

    return pools;
  } catch (error) {
    console.error('❌ Erreur Aave GraphQL API:', error);
    return [];
  }
}

// ============================================
// CONCRETE XYZ - Vault API
// ============================================

export async function fetchConcretePools(): Promise<Partial<YieldPool>[]> {
  try {
    const response = await fetch('https://apy.api.concrete.xyz/v1/vault:tvl/all');

    if (!response.ok) {
      throw new Error(`Concrete API error: ${response.status}`);
    }

    const data = await response.json();
    const pools: Partial<YieldPool>[] = [];

    // Chain mapping
    const chainMap: Record<number, string> = {
      1: 'Ethereum',
      42161: 'Arbitrum',
      80094: 'Berachain',
      988: 'Katana',
      747474: 'Corn',
    };

    // Stablecoins to include
    const stablecoins = ['USDC', 'USDT', 'DAI', 'USDe', 'USDS', 'frxUSD'];

    // Parse data by chain
    Object.entries(data).forEach(([chainIdStr, vaults]: [string, any]) => {
      const chainId = parseInt(chainIdStr);
      const chainName = chainMap[chainId];

      if (!chainName) {
        return; // Skip unknown chains
      }

      Object.values(vaults).forEach((vault: any) => {
        const symbol = vault.symbol || '';
        const name = vault.name || '';

        // Check if vault contains stablecoin
        const isStablecoinVault = stablecoins.some(
          (s) => symbol.includes(s) || name.includes(s)
        );

        if (!isStablecoinVault) {
          return;
        }

        // Determine stablecoin type
        let stablecoinType = 'USDC'; // default
        for (const coin of stablecoins) {
          if (symbol.includes(coin) || name.includes(coin)) {
            stablecoinType = coin === 'frxUSD' ? 'USDS' : coin; // Map frxUSD to USDS
            break;
          }
        }

        // Skip if not in our supported types
        const supportedTypes = ['USDC', 'USDT', 'DAI', 'USDe', 'USDS'];
        if (!supportedTypes.includes(stablecoinType)) {
          return;
        }

        const tvl = parseFloat(vault.tvl || '0');
        // Use peak_apy as approximation (Concrete doesn't expose current APY via API)
        const apyDecimal = parseFloat(vault.peak_apy || '0');
        const apy = apyDecimal * 100;

        // Skip if TVL is 0 or very low
        if (tvl < 1000) {
          return;
        }

        pools.push({
          id: `concrete-${vault.address.toLowerCase()}`,
          protocol: 'Concrete',
          chain: chainName as any,
          symbol: vault.symbol,
          stablecoin: stablecoinType as any,
          apy: apy,
          apyBase: apy,
          apyReward: 0,
          tvl: tvl,
          poolUrl: `https://app.concrete.xyz/earn`,
        });
      });
    });

    return pools;
  } catch (error) {
    console.error('❌ Erreur Concrete API:', error);
    return [];
  }
}

// ============================================
// SILO V2 - Lending Pools API
// ============================================

export async function fetchSiloPools(): Promise<Partial<YieldPool>[]> {
  try {
    const requestBody = {
      search: null,
      chainKeys: [],
      type: 'silo', // Lending pools (not vaults)
      sort: null,
      limit: 200,
      offset: 0,
    };

    const response = await fetch('https://app.silo.finance/api/earn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Silo API error: ${response.status}`);
    }

    const data = await response.json();
    const pools: Partial<YieldPool>[] = [];

    // Chain mapping (excluded: Sonic)
    const chainMap: Record<string, string> = {
      ethereum: 'Ethereum',
      arbitrum: 'Arbitrum',
      avalanche: 'Avalanche',
    };

    // Stablecoins to include
    const stablecoins = ['USDC', 'USDT', 'DAI', 'USDe', 'USDS'];

    if (data.pools && Array.isArray(data.pools)) {
      data.pools.forEach((silo: any) => {
        const tokenSymbol = silo.tokenSymbol || '';

        // Check if it's a stablecoin
        if (!stablecoins.includes(tokenSymbol)) {
          return;
        }

        const chainKey = silo.chainKey || '';
        const chainName = chainMap[chainKey] || chainKey;

        // Convert APR from wei format (e.g., "179825656813018339" = 17.98%)
        const supplyAprWei = silo.supplyApr || '0';
        const apy = parseFloat(supplyAprWei) / 1e16;

        // Convert TVL from wei format
        const tvlWei = silo.totalSupplyUsd || '0';
        const tvl = parseFloat(tvlWei);

        // Skip pools with 0 APY or very low TVL
        if (apy === 0 || tvl < 1000) {
          return;
        }

        // Determine protocol version
        const protocol = silo.siloSymbol0 || silo.siloSymbol1 ? 'Silo V2' : 'Silo';

        pools.push({
          id: `silo-${silo.siloId || silo.id}`,
          protocol: protocol,
          chain: chainName as any,
          symbol: tokenSymbol,
          stablecoin: tokenSymbol as any,
          apy: apy,
          apyBase: apy,
          apyReward: 0,
          tvl: tvl,
          poolUrl: 'https://app.silo.finance/',
        });
      });
    }

    return pools;
  } catch (error) {
    console.error('❌ Erreur Silo API:', error);
    return [];
  }
}

// ============================================
// VENUS PROTOCOL - BSC
// ============================================

export async function fetchVenusPools(): Promise<Partial<YieldPool>[]> {
  const pools: Partial<YieldPool>[] = [];

  try {
    // Récupérer tous les marchés avec pagination
    const response = await fetch('https://api.venus.io/markets?chainId=56&limit=100&page=0', {
      headers: {
        'accept-version': 'stable',
        'Content-Type': 'application/json',
      },
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`❌ Venus API error: ${response.status} ${response.statusText}`);
      return pools;
    }

    const data = await response.json();
    const markets = data.result || [];

    console.log(`📊 Venus: ${markets.length} markets reçus`);

    // Stablecoins supportés (garder seulement les principaux pour commencer)
    const stablecoins = ['USDC', 'USDT', 'DAI', 'USD1'];

    markets.forEach((market: any) => {
      const symbol = market.underlyingSymbol?.toUpperCase() || '';
      const vTokenSymbol = market.symbol?.toUpperCase() || '';

      // Ne garder que les stablecoins supportés
      if (!stablecoins.includes(symbol)) {
        return;
      }

      // Ne garder que les pools principaux (pas GameFi, DeFi, Meme, Tron, Stablecoins)
      // Les pools principaux ont des vTokens simples comme vUSDT, vUSDC, vDAI, vUSD1
      if (vTokenSymbol.includes('_')) {
        return; // Skip les pools secondaires avec underscore (vUSDT_GameFi, vUSDT_DeFi, etc.)
      }

      // Parse APY (déjà en pourcentage dans supplyApy)
      const supplyApy = parseFloat(market.supplyApy || '0');

      // TVL en USD à partir de totalSupplyUnderlyingCents (divide by 100 to convert cents to dollars)
      const tvl = parseFloat(market.totalSupplyUnderlyingCents || '0') / 100;

      // Skip si TVL ou APY invalide
      // Utiliser un seuil plus bas pour Venus pour inclure plus de pools
      if (tvl < 100000 || supplyApy <= 0 || supplyApy > 100) {
        return;
      }

      // URL du pool spécifique avec le market address
      const poolUrl = `https://app.venus.io/#/pool/${market.poolComptrollerAddress}/market/${market.address}?chainId=56&tab=supply`;

      pools.push({
        id: `venus-${market.address}`,
        protocol: 'Venus',
        chain: 'BSC',
        symbol: symbol,
        stablecoin: symbol as 'USDC' | 'USDT' | 'DAI' | 'USD1',
        apy: supplyApy,
        apyBase: supplyApy,
        apyReward: 0,
        tvl: tvl,
        poolUrl: poolUrl,
      });
    });

    console.log(`✅ Venus: ${pools.length} stablecoin pools filtrés`);
    return pools;

  } catch (error: any) {
    console.error('❌ Erreur lors de la récupération des pools Venus:', error.message || error);
    return pools;
  }
}

// ============================================
// CAP MONEY - Ethereum
// ============================================

interface CapVault {
  id: string;
  name: string;
  tokenId: string;
  networkId: number;
  status: string;
  type: string;
}

interface CapLenderMetrics {
  depositApy: number;
  totalDeposits: number;
  totalDepositsUsd: number;
}

export async function fetchCapPools(): Promise<Partial<YieldPool>[]> {
  try {
    const pools: Partial<YieldPool>[] = [];

    // Network mapping
    const networkMap: Record<number, string> = {
      1: 'Ethereum',
    };

    // Supported networks
    const networks = [1]; // Ethereum mainnet

    // Stablecoins supported by Cap (currently only USDC)
    const stablecoins = ['USDC'];

    for (const networkId of networks) {
      for (const tokenSymbol of stablecoins) {
        try {
          // Try direct API call (may fail due to CORS in browser)
          const endpoint = `https://api.cap.app/v1/lender/${networkId}/metrics/${tokenSymbol}`;

          const metricsResponse = await fetch(endpoint);

          if (!metricsResponse.ok) {
            continue; // Skip if no metrics for this token
          }

          const metrics = await metricsResponse.json();

          // Parse TVL from suppliedUSD (string format)
          const tvl = parseFloat(metrics.suppliedUSD || '0');

          // Skip if no TVL
          if (tvl < 100000) {
            continue;
          }

          // APY from Cap is the interestRate field (decimal format: 0.0468 = 4.68%)
          const apy = parseFloat(metrics.interestRate || '0') * 100;

          // Skip very low APY
          if (apy < 0.1) {
            continue;
          }

          const chainName = networkMap[networkId] || 'Ethereum';

          pools.push({
            id: `cap-${tokenSymbol.toLowerCase()}-${chainName.toLowerCase()}`,
            protocol: 'Cap Money',
            chain: chainName as any,
            symbol: tokenSymbol,
            stablecoin: tokenSymbol as any,
            apy: apy,
            apyBase: apy,
            apyReward: 0,
            tvl: tvl,
            poolUrl: `https://cap.app/asset/${networkId}/${tokenSymbol}`,
          });

          console.log(`✅ Cap Money ${tokenSymbol}: APY ${apy.toFixed(2)}%, TVL $${(tvl/1e6).toFixed(2)}M`);
        } catch (tokenError) {
          // Silent fail for individual tokens
          continue;
        }
      }
    }

    return pools;
  } catch (error) {
    console.error('❌ Erreur Cap Money API:', error);
    return [];
  }
}

// ============================================
// HYPERLIQUID PROTOCOLS
// ============================================

// Felix Protocol - Hyperliquid L1 lending
// Docs: https://usefelix.gitbook.io/docs
// Felix stablecoin mapping from Morpho vault assets
// Note: USDH and USDHL are NOT included - they are separate Hyperliquid stablecoins
const FELIX_STABLECOIN_MAP: Record<string, string> = {
  'USDC': 'USDC',
  'USD₮0': 'USDT',
  'USDT0': 'USDT',
  'USDe': 'USDe',
};

export async function fetchFelixPools(): Promise<Partial<YieldPool>[]> {
  try {
    // Felix vaults are on Morpho - use Morpho GraphQL API
    // Hyperliquid chain ID on Morpho is 999
    const query = `{
      vaults(where: { chainId_in: [999] }, first: 100) {
        items {
          address
          name
          symbol
          asset { symbol }
          state { totalAssetsUsd apy netApy }
        }
      }
    }`;

    const response = await fetch('https://api.morpho.org/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      console.warn('⚠️ Morpho API failed for Felix, using fallback');
      return fetchFelixFromDefiLlama();
    }

    const json = await response.json();
    const vaults = json.data?.vaults?.items || [];
    const pools: Partial<YieldPool>[] = [];

    for (const vault of vaults) {
      // Only include Felix vaults (symbol starts with 'fe')
      if (!vault.symbol?.toLowerCase().startsWith('fe')) continue;

      const assetSymbol = vault.asset?.symbol || '';
      const stablecoin = FELIX_STABLECOIN_MAP[assetSymbol];

      // Only include supported stablecoins
      if (!stablecoin) continue;

      const tvl = vault.state?.totalAssetsUsd || 0;
      const apy = (vault.state?.netApy || vault.state?.apy || 0) * 100; // Convert to percentage

      // Skip low TVL pools
      if (tvl < 100000) continue;

      pools.push({
        id: `felix-${stablecoin.toLowerCase()}-hyperliquid-${vault.address.slice(-8)}`,
        protocol: 'Felix',
        chain: 'Hyperliquid',
        symbol: vault.symbol,
        stablecoin: stablecoin as any,
        apy: apy,
        apyBase: apy,
        apyReward: 0,
        tvl: tvl,
        poolUrl: 'https://usefelix.xyz/',
        curator: 'Felix', // Felix is the curator for these vaults
      });
    }

    console.log(`✅ Felix: ${pools.length} stablecoin vaults trouvés via Morpho API`);
    return pools;
  } catch (error) {
    console.error('❌ Erreur Felix/Morpho API:', error);
    return fetchFelixFromDefiLlama();
  }
}

async function fetchFelixFromDefiLlama(): Promise<Partial<YieldPool>[]> {
  try {
    const response = await fetch('https://yields.llama.fi/pools');
    if (!response.ok) return [];

    const json = await response.json();
    const pools: Partial<YieldPool>[] = [];

    for (const pool of json.data || []) {
      // Match morpho-v1 pools on Hyperliquid with FE* symbols
      if (pool.project === 'morpho-v1' && pool.chain === 'Hyperliquid') {
        const symbol = pool.symbol?.toUpperCase() || '';
        if (!symbol.startsWith('FE')) continue;

        const stablecoin = FELIX_STABLECOIN_MAP[symbol] ||
                          (symbol.includes('USDC') ? 'USDC' :
                           symbol.includes('USDT') ? 'USDT' : null);
        if (!stablecoin) continue;

        pools.push({
          id: `felix-${stablecoin.toLowerCase()}-hyperliquid-${pool.pool?.slice(-8) || ''}`,
          protocol: 'Felix',
          chain: 'Hyperliquid',
          symbol: symbol,
          stablecoin: stablecoin as any,
          apy: pool.apy || 0,
          apyBase: pool.apyBase || pool.apy || 0,
          apyReward: pool.apyReward || 0,
          tvl: pool.tvlUsd || 0,
          poolUrl: 'https://usefelix.xyz/',
          curator: 'Felix',
        });
      }
    }

    console.log(`✅ Felix: ${pools.length} pools via DefiLlama fallback`);
    return pools;
  } catch (error) {
    console.error('❌ Erreur Felix DefiLlama fallback:', error);
    return [];
  }
}

// HyperLend - Hyperliquid L1 lending protocol
// Docs: https://docs.hyperlend.finance/developer-documentation/api
// Stablecoin symbol mapping for HyperLend
// Note: USDH is NOT mapped - it's Hyperliquid's native stablecoin, separate from USDC
const HYPERLEND_STABLECOIN_MAP: Record<string, { stablecoin: string; decimals: number }> = {
  'USDC': { stablecoin: 'USDC', decimals: 6 },
  'USD₮0': { stablecoin: 'USDT', decimals: 6 },
  'USDT0': { stablecoin: 'USDT', decimals: 6 },
  'USDe': { stablecoin: 'USDe', decimals: 18 },
};

export async function fetchHyperLendPools(): Promise<Partial<YieldPool>[]> {
  try {
    // Fetch both markets and rates in parallel
    const [marketsRes, ratesRes] = await Promise.all([
      fetch('https://api.hyperlend.finance/data/markets?chain=hyperEvm'),
      fetch('https://api.hyperlend.finance/data/markets/rates?chain=hyperEvm'),
    ]);

    if (!marketsRes.ok || !ratesRes.ok) {
      console.warn('⚠️ HyperLend API failed, using DefiLlama fallback');
      return fetchHyperLendFromDefiLlama();
    }

    const marketsData = await marketsRes.json();
    const ratesData = await ratesRes.json();
    const pools: Partial<YieldPool>[] = [];

    // Process reserves from markets data
    const reserves = marketsData.reserves || {};

    for (const [address, reserve] of Object.entries(reserves) as [string, any][]) {
      const symbol = reserve.symbol || '';
      const mapping = HYPERLEND_STABLECOIN_MAP[symbol];

      if (!mapping) continue;

      // Get rates for this token
      const underlyingAsset = reserve.underlyingAsset;
      const rates = ratesData[underlyingAsset];

      if (!rates) continue;

      // Calculate TVL = Available Liquidity + Total Borrowed
      // In Aave-style protocols: Total Borrowed = totalScaledVariableDebt * liquidityIndex / 1e27 (Ray)
      const decimals = parseInt(reserve.decimals || mapping.decimals.toString());
      const RAY = 1e27;

      const availableLiquidity = parseFloat(reserve.availableLiquidity || '0');
      const scaledDebt = parseFloat(reserve.totalScaledVariableDebt || '0');
      const liquidityIndex = parseFloat(reserve.liquidityIndex || RAY.toString());

      // Calculate actual borrowed amount (scaled debt adjusted by liquidity index)
      const totalBorrowed = (scaledDebt * liquidityIndex) / RAY;

      // TVL = available + borrowed, then convert from token decimals
      const tvl = (availableLiquidity + totalBorrowed) / Math.pow(10, decimals);

      // APY is already in percentage form in the API
      const supplyApy = rates.supplyAPY || 0;

      // Skip if no meaningful data
      if (tvl < 100000 || supplyApy <= 0) continue;

      pools.push({
        id: `hyperlend-${mapping.stablecoin.toLowerCase()}-hyperliquid`,
        protocol: 'HyperLend',
        chain: 'Hyperliquid',
        symbol: mapping.stablecoin,
        stablecoin: mapping.stablecoin as any,
        apy: supplyApy,
        apyBase: supplyApy,
        apyReward: 0,
        tvl: tvl,
        poolUrl: 'https://app.hyperlend.finance/',
      });
    }

    console.log(`✅ HyperLend: ${pools.length} stablecoin pools trouvés via API`);
    return pools;
  } catch (error) {
    console.error('❌ Erreur HyperLend API:', error);
    return fetchHyperLendFromDefiLlama();
  }
}

async function fetchHyperLendFromDefiLlama(): Promise<Partial<YieldPool>[]> {
  try {
    const response = await fetch('https://yields.llama.fi/pools');
    if (!response.ok) return [];

    const json = await response.json();
    const pools: Partial<YieldPool>[] = [];

    for (const pool of json.data || []) {
      if ((pool.project === 'hyperlend' || pool.project === 'hyperlend-pooled') && pool.chain === 'Hyperliquid') {
        const symbol = pool.symbol?.toUpperCase()?.split('-')[0] || '';
        const mapping = HYPERLEND_STABLECOIN_MAP[symbol];
        if (!mapping) continue;

        pools.push({
          id: `hyperlend-${mapping.stablecoin.toLowerCase()}-hyperliquid`,
          protocol: 'HyperLend',
          chain: 'Hyperliquid',
          symbol: mapping.stablecoin,
          stablecoin: mapping.stablecoin as any,
          apy: pool.apy || 0,
          apyBase: pool.apyBase || pool.apy || 0,
          apyReward: pool.apyReward || 0,
          tvl: pool.tvlUsd || 0,
          poolUrl: 'https://app.hyperlend.finance/',
        });
      }
    }

    console.log(`✅ HyperLend: ${pools.length} pools via DefiLlama fallback`);
    return pools;
  } catch (error) {
    console.error('❌ Erreur HyperLend DefiLlama fallback:', error);
    return [];
  }
}

// HyperBeat - Hyperliquid yield optimizer
// Docs: https://docs.hyperbeat.org/
// Note: HyperBeat vaults appear under morpho-v1 or pendle in DefiLlama with HB* prefix
// Similar to Felix (FE*), we detect them by symbol prefix
export async function fetchHyperBeatPools(): Promise<Partial<YieldPool>[]> {
  // HyperBeat vaults are detected in usePools.ts transformPool()
  // by looking for HB* symbols on Hyperliquid chain under morpho-v1/pendle
  // This function returns empty since the pools come through DefiLlama
  // and get rebranded in transformPool()
  return [];
}

// ============================================
// MERKL API - External Incentives/Rewards
// Fetches additional APY from Merkl reward campaigns
// Docs: https://docs.merkl.xyz/integrate-merkl/app
// ============================================

interface MerklOpportunity {
  identifier: string;
  name: string;
  chainId: number;
  apr: number; // Already in percentage (50.41 = 50.41%)
  tvl: number;
  protocol?: {
    name: string;
  };
  tokens?: Array<{
    symbol: string;
  }>;
}

// Chain ID to name mapping
const MERKL_CHAIN_MAP: Record<number, string> = {
  1: 'Ethereum',
  10: 'Optimism',
  42161: 'Arbitrum',
  8453: 'Base',
  137: 'Polygon',
  100: 'Gnosis',
  43114: 'Avalanche',
  56: 'BSC',
  59144: 'Linea',
};

// Stablecoins we care about
const MERKL_STABLECOINS = ['USDC', 'USDT', 'DAI', 'USDS', 'USDe', 'PYUSD', 'USDG', 'GHO', 'FRAX', 'LUSD', 'crvUSD'];

// Cache for Merkl data (refresh every 10 minutes)
let merklCache: { data: Map<string, number>; timestamp: number } = {
  data: new Map(),
  timestamp: 0,
};
const MERKL_CACHE_TTL = 10 * 60 * 1000; // 10 minutes

/**
 * Fetch Merkl opportunities and return a map of pool identifiers to additional APR
 * The key format is: {protocol}-{stablecoin}-{chain} (lowercase)
 */
export async function fetchMerklRewards(): Promise<Map<string, number>> {
  const now = Date.now();
  if (merklCache.data.size > 0 && (now - merklCache.timestamp) < MERKL_CACHE_TTL) {
    return merklCache.data;
  }

  const rewardsMap = new Map<string, number>();

  try {
    // Fetch opportunities from Merkl API for each chain
    const chainIds = Object.keys(MERKL_CHAIN_MAP).map(Number);

    const fetchPromises = chainIds.map(async (chainId) => {
      try {
        const response = await fetch(
          `https://api.merkl.xyz/v4/opportunities?chainId=${chainId}`,
          { cache: 'no-store' }
        );

        if (!response.ok) return [];

        const data = await response.json();
        return data || [];
      } catch {
        return [];
      }
    });

    const results = await Promise.allSettled(fetchPromises);

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      if (result.status !== 'fulfilled') continue;

      const opportunities = result.value;
      const chainId = chainIds[i];
      const chainName = MERKL_CHAIN_MAP[chainId];

      for (const opp of opportunities) {
        // Skip if no meaningful APR
        if (!opp.apr || opp.apr <= 0) continue;

        // Try to identify the protocol and token from the opportunity
        const protocolName = opp.protocol?.name?.toLowerCase() || '';
        const tokens = opp.tokens || [];

        // Find stablecoin in tokens
        let stablecoin = '';
        for (const token of tokens) {
          const symbol = token.symbol?.toUpperCase() || '';
          if (MERKL_STABLECOINS.includes(symbol)) {
            stablecoin = symbol;
            break;
          }
        }

        if (!stablecoin) continue;

        // Map protocol names to our format
        const protocolMap: Record<string, string> = {
          'aave': 'aave-v3',
          'aave v3': 'aave-v3',
          'morpho': 'morpho-blue',
          'morpho blue': 'morpho-blue',
          'compound': 'compound-v3',
          'compound v3': 'compound-v3',
          'euler': 'euler-v2',
          'euler v2': 'euler-v2',
          'spark': 'sparklend',
          'sparklend': 'sparklend',
          'fluid': 'fluid',
        };

        let normalizedProtocol = '';
        for (const [key, value] of Object.entries(protocolMap)) {
          if (protocolName.includes(key)) {
            normalizedProtocol = value;
            break;
          }
        }

        if (!normalizedProtocol) continue;

        // Create key matching our pool ID format
        const key = `${normalizedProtocol}-${stablecoin.toLowerCase()}-${chainName.toLowerCase()}`;

        // Add to map (use highest APR if multiple campaigns for same pool)
        const existingApr = rewardsMap.get(key) || 0;
        if (opp.apr > existingApr) {
          rewardsMap.set(key, opp.apr);
        }
      }
    }

    // Update cache
    merklCache = { data: rewardsMap, timestamp: now };
    console.log(`✅ Merkl: ${rewardsMap.size} reward opportunities loaded`);

    return rewardsMap;
  } catch (error) {
    console.error('❌ Erreur Merkl API:', error);
    return rewardsMap;
  }
}

/**
 * Get Merkl reward APR for a specific pool
 */
export function getMerklRewardApr(protocol: string, stablecoin: string, chain: string): number {
  const key = `${protocol.toLowerCase()}-${stablecoin.toLowerCase()}-${chain.toLowerCase()}`;
  return merklCache.data.get(key) || 0;
}

// ============================================
// FONCTION PRINCIPALE : Récupérer tous les pools personnalisés
// ============================================

export async function fetchAllCustomPools(): Promise<Partial<YieldPool>[]> {
  console.log('🔄 Chargement des pools personnalisés...');

  // Fetch Merkl rewards in parallel with pools
  const merklPromise = fetchMerklRewards();

  const results = await Promise.allSettled([
    fetchKaminoPools(),
    fetchSteakhousePools(),
    fetchFluidPools(),
    fetchJupiterPools(),
    fetchVenusPools(), // Utilise l'API Venus pour avoir USD1 et vraies TVL
    fetchCapPools(), // Cap Money - Ethereum stablecoin yields
    fetchAavePools(), // Aave V3 GraphQL API for accurate TVL
    // Hyperliquid protocols
    fetchFelixPools(),
    fetchHyperLendPools(),
    fetchHyperBeatPools(),
    // RWA protocols
    fetchRealTokenPools(), // RealT RMM - Tokenized real estate on Gnosis
    // fetchConcretePools(), // Désactivé - erreurs CORS
    // fetchSiloPools(), // Désactivé - erreurs CORS
    // fetchMellowPools(), // Désactivé - pas de vaults stablecoins
  ]);

  // Wait for Merkl rewards to be ready
  await merklPromise;

  const allPools: Partial<YieldPool>[] = [];

  const protocolNames = ['Kamino', 'Steakhouse', 'Fluid', 'Jupiter Lend', 'Venus', 'Cap Money', 'Aave V3', 'Felix', 'HyperLend', 'HyperBeat', 'RealT RMM'];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      allPools.push(...result.value);
      console.log(`✅ ${protocolNames[index]}: ${result.value.length} pools chargés`);
    } else {
      console.error(`❌ ${protocolNames[index]}: ${result.reason}`);
    }
  });

  return allPools;
}
