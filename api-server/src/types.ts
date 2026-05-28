export interface YieldPool {
  id: string;
  protocol: string;
  chain: string;
  symbol: string;
  stablecoin: string;
  apy: number;
  apyBase: number;
  apyReward: number;
  merklRewardApr?: number;
  tvl: number;
  securityScore: number;
  yiieldScore: number;
  poolUrl?: string;
}

export interface Protocol {
  slug: string;
  name: string;
  poolCount: number;
  totalTvl: number;
  avgApy: number;
  chains: string[];
  securityScore: number;
}

export interface Stats {
  totalPools: number;
  totalTvl: number;
  avgApy: number;
  topApy: number;
  protocolCount: number;
  chainCount: number;
  lastUpdated: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    lastUpdated?: string;
  };
}

export interface DefiLlamaPool {
  pool: string;
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apy: number;
  apyBase?: number;
  apyReward?: number;
  stablecoin: boolean;
}

export interface MerklOpportunity {
  identifier: string;
  chainId: number;
  apr: number;
  tvl: number;
  name: string;
  protocol?: {
    id: string;
    name: string;
  };
}
