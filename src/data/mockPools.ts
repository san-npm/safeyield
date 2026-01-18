import { YieldPool, StablecoinType, ApyHistoryPoint, ProtocolType, FilterState } from '@/types';

// Fonction pour générer un historique APY réaliste
function generateApyHistory(baseApy: number, volatility: number = 0.1): ApyHistoryPoint[] {
  const history: ApyHistoryPoint[] = [];
  const now = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const variation = (Math.random() - 0.5) * 2 * volatility;
    const apy = baseApy * (1 + variation);
    
    history.push({
      timestamp: date,
      apy: Math.max(0.1, apy)
    });
  }
  
  history[history.length - 1].apy = baseApy;
  return history;
}

// Helper pour créer un pool
function createPool(
  id: string,
  protocol: string,
  protocolType: ProtocolType,
  chain: string,
  stablecoin: StablecoinType,
  apy: number,
  apyBase: number,
  apyReward: number,
  tvl: number,
  securityScore: number,
  audits: number,
  protocolAge: number,
  exploits: number,
  poolUrl: string
): YieldPool {
  const protocolSlug = protocol.toLowerCase().replace(/\s+/g, '-');
  const chainSlug = chain.toLowerCase();
  
  const stablecoinLogos: Record<StablecoinType, string> = {
    'USDC': 'https://assets.coingecko.com/coins/images/6319/small/usdc.png',
    'USDT': 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
    'USDT0': 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
    'DAI': 'https://assets.coingecko.com/coins/images/9956/small/dai-multi-collateral-mcd.png',
    'USDS': 'https://assets.coingecko.com/coins/images/39926/small/usds.webp',
    'PYUSD': 'https://assets.coingecko.com/coins/images/31212/small/PYUSD_Logo_%282%29.png',
    'EURe': 'https://assets.coingecko.com/coins/images/23354/small/eure.png',
    'EURC': 'https://assets.coingecko.com/coins/images/26045/small/euro-coin.png',
  };

  return {
    id,
    protocol,
    protocolLogo: `https://icons.llama.fi/${protocolSlug}.png`,
    protocolType,
    chain,
    chainLogo: `https://icons.llama.fi/${chainSlug}.png`,
    symbol: stablecoin,
    stablecoin,
    stablecoinLogo: stablecoinLogos[stablecoin],
    apy,
    apyBase,
    apyReward,
    tvl,
    tvlChange24h: Math.random() * 10 - 5,
    securityScore,
    audits,
    protocolAge,
    exploits,
    exploitHistory: [],
    poolUrl,
    lastUpdated: new Date(),
    apyHistory: generateApyHistory(apy, 0.1),
  };
}

// Données de démonstration
export const MOCK_POOLS: YieldPool[] = [
  // Lending protocols
  createPool('aave-v3-usdc-eth', 'Aave V3', 'lending', 'Ethereum', 'USDC', 5.82, 4.12, 1.70, 2_340_000_000, 95, 5, 1020, 0, 'https://app.aave.com/'),
  createPool('aave-v3-usdt-arb', 'Aave V3', 'lending', 'Arbitrum', 'USDT', 5.45, 4.50, 0.95, 890_000_000, 95, 5, 1020, 0, 'https://app.aave.com/'),
  createPool('aave-v3-dai-eth', 'Aave V3', 'lending', 'Ethereum', 'DAI', 4.92, 4.92, 0, 1_200_000_000, 95, 5, 1020, 0, 'https://app.aave.com/'),
  
  createPool('morpho-blue-usdc-base', 'Morpho Blue', 'lending', 'Base', 'USDC', 6.45, 6.45, 0, 890_000_000, 85, 3, 365, 0, 'https://app.morpho.org/'),
  createPool('morpho-blue-usdc-eth', 'Morpho Blue', 'lending', 'Ethereum', 'USDC', 5.80, 5.80, 0, 1_500_000_000, 85, 3, 365, 0, 'https://app.morpho.org/'),
  
  createPool('spark-dai-eth', 'Spark', 'lending', 'Ethereum', 'DAI', 5.50, 5.50, 0, 1_200_000_000, 88, 3, 600, 0, 'https://app.spark.fi/'),
  createPool('spark-usds-eth', 'Spark', 'lending', 'Ethereum', 'USDS', 6.00, 6.00, 0, 800_000_000, 88, 3, 600, 0, 'https://app.spark.fi/'),
  
  createPool('compound-v3-usdc-eth', 'Compound V3', 'lending', 'Ethereum', 'USDC', 4.85, 3.95, 0.90, 1_850_000_000, 92, 4, 850, 0, 'https://app.compound.finance/markets'),
  createPool('compound-v3-usdc-arb', 'Compound V3', 'lending', 'Arbitrum', 'USDC', 5.20, 4.30, 0.90, 450_000_000, 92, 4, 850, 0, 'https://app.compound.finance/markets'),
  
  createPool('fluid-usdc-eth', 'Fluid', 'lending', 'Ethereum', 'USDC', 7.20, 7.20, 0, 320_000_000, 78, 2, 180, 0, 'https://fluid.instadapp.io/lending'),
  createPool('fluid-usdt-eth', 'Fluid', 'lending', 'Ethereum', 'USDT', 6.80, 6.80, 0, 280_000_000, 78, 2, 180, 0, 'https://fluid.instadapp.io/lending'),
  
  createPool('kamino-usdc-sol', 'Kamino', 'lending', 'Solana', 'USDC', 8.50, 6.50, 2.00, 450_000_000, 75, 2, 400, 0, 'https://app.kamino.finance/lending'),
  createPool('kamino-usdt-sol', 'Kamino', 'lending', 'Solana', 'USDT', 7.80, 5.80, 2.00, 320_000_000, 75, 2, 400, 0, 'https://app.kamino.finance/lending'),
  
  createPool('venus-usdc-bsc', 'Venus', 'lending', 'BSC', 'USDC', 5.10, 4.10, 1.00, 380_000_000, 72, 3, 1200, 1, 'https://app.venus.io/core-pool'),
  createPool('venus-usdt-bsc', 'Venus', 'lending', 'BSC', 'USDT', 4.80, 3.80, 1.00, 520_000_000, 72, 3, 1200, 1, 'https://app.venus.io/core-pool'),
  
  createPool('benqi-usdc-avax', 'Benqi', 'lending', 'Avalanche', 'USDC', 4.50, 3.50, 1.00, 180_000_000, 76, 2, 900, 0, 'https://app.benqi.fi/markets'),
  
  createPool('radiant-usdc-arb', 'Radiant V2', 'lending', 'Arbitrum', 'USDC', 6.80, 4.80, 2.00, 220_000_000, 70, 2, 500, 1, 'https://app.radiant.capital/'),
  
  // Vault managers
  createPool('steakhouse-usdc-eth', 'Steakhouse', 'vault', 'Ethereum', 'USDC', 7.50, 7.50, 0, 150_000_000, 80, 2, 400, 0, 'https://www.steakhouse.financial/'),
  createPool('veda-usdc-eth', 'Veda', 'vault', 'Ethereum', 'USDC', 8.20, 8.20, 0, 80_000_000, 75, 2, 200, 0, 'https://www.veda.tech/'),
  createPool('mellow-usdc-eth', 'Mellow', 'vault', 'Ethereum', 'USDC', 7.80, 7.80, 0, 120_000_000, 76, 2, 250, 0, 'https://app.mellow.finance/'),
];

// Fonctions de filtrage
export function filterPools(pools: YieldPool[], filters: FilterState): YieldPool[] {
  return pools.filter(pool => {
    // Filtre par stablecoin
    if (filters.stablecoins.length > 0 && !filters.stablecoins.includes(pool.stablecoin)) {
      return false;
    }
    
    // Filtre par chaîne
    if (filters.chains.length > 0 && !filters.chains.includes(pool.chain)) {
      return false;
    }
    
    // Filtre par APY minimum
    if (filters.minApy > 0 && pool.apy < filters.minApy) {
      return false;
    }
    
    // Filtre par TVL minimum
    if (filters.minTvl > 0 && pool.tvl < filters.minTvl) {
      return false;
    }
    
    // Filtre par score de sécurité minimum
    if (filters.minSecurityScore > 0 && pool.securityScore < filters.minSecurityScore) {
      return false;
    }
    
    return true;
  });
}

// Fonction pour obtenir les top pools
export function getTopPools(pools: YieldPool[], count: number = 3): YieldPool[] {
  return [...pools]
    .sort((a, b) => {
      // Score combiné : APY (40%) + Sécurité (60%)
      const scoreA = a.apy * 0.4 + a.securityScore * 0.06;
      const scoreB = b.apy * 0.4 + b.securityScore * 0.06;
      return scoreB - scoreA;
    })
    .slice(0, count);
}
