export interface Pool {
  pool: string;
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apyBase?: number;
  apyReward?: number;
  apy: number;
  rewardTokens?: string[];
  underlyingTokens?: string[];
  poolMeta?: string;
  il7d?: number;
  apyBase7d?: number;
  apyMean30d?: number;
  volumeUsd1d?: number;
  volumeUsd7d?: number;
  apyBaseInception?: number;
}

export interface PoolWithSecurity extends Pool {
  securityScore: number;
  securityLevel: 'excellent' | 'good' | 'moderate' | 'risky' | 'danger';
}

export interface ChainInfo {
  name: string;
  logo: string;
  id: string;
}

export interface ProtocolInfo {
  name: string;
  logo: string;
  url?: string;
}

export const CHAINS: Record<string, ChainInfo> = {
  Ethereum: { name: 'Ethereum', logo: '/logos/ethereum.svg', id: 'ethereum' },
  Arbitrum: { name: 'Arbitrum', logo: '/logos/arbitrum.svg', id: 'arbitrum' },
  Optimism: { name: 'Optimism', logo: '/logos/optimism.svg', id: 'optimism' },
  Base: { name: 'Base', logo: '/logos/base.svg', id: 'base' },
  Polygon: { name: 'Polygon', logo: '/logos/polygon.svg', id: 'polygon' },
  Avalanche: { name: 'Avalanche', logo: '/logos/avalanche.svg', id: 'avalanche' },
  BSC: { name: 'BNB Chain', logo: '/logos/bnb.svg', id: 'bsc' },
  Linea: { name: 'Linea', logo: '/logos/linea.svg', id: 'linea' },
};

export const PROTOCOLS: Record<string, ProtocolInfo> = {
  aave: { name: 'Aave', logo: '/logos/aave.svg', url: 'https://aave.com' },
  compound: { name: 'Compound', logo: '/logos/compound.svg', url: 'https://compound.finance' },
  curve: { name: 'Curve', logo: '/logos/curve.svg', url: 'https://curve.fi' },
  uniswap: { name: 'Uniswap', logo: '/logos/uniswap.svg', url: 'https://uniswap.org' },
  benqi: { name: 'Benqi', logo: '/logos/benqi.svg', url: 'https://benqi.fi' },
  lagoon: { name: 'Lagoon', logo: '/logos/lagoon.svg', url: 'https://lagoon.finance' },
  'yearn-finance': { name: 'Yearn', logo: '/logos/yearn.svg', url: 'https://yearn.finance' },
  'maker-dao': { name: 'MakerDAO', logo: '/logos/maker.svg', url: 'https://makerdao.com' },
};

export const STABLECOINS = [
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
] as const;

export type Stablecoin = (typeof STABLECOINS)[number];
