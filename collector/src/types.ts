// ============================================
// Types for APY History Collector
// ============================================

export interface HourlyDataPoint {
  /** ISO timestamp */
  t: string;
  /** APY in percentage (e.g., 3.42 = 3.42%) */
  apy: number;
  /** TVL in USD */
  tvl: number;
}

export interface PoolHistory {
  poolId: string;
  protocol: string;
  chain: string;
  stablecoin: string;
  lastUpdated: string;
  /** Hourly data points, most recent first */
  hourly: HourlyDataPoint[];
}

export interface PoolIndexEntry {
  /** IPFS hash of the pool history file */
  hash: string;
  /** Latest APY for quick access */
  latestApy: number;
  /** Latest TVL for quick access */
  latestTvl: number;
}

export interface HistoryIndex {
  version: string;
  lastCollected: string;
  totalPools: number;
  pools: Record<string, PoolIndexEntry>;
}

// Pool data from fetchers
export interface PoolData {
  id: string;
  protocol: string;
  chain: string;
  stablecoin: string;
  symbol: string;
  apy: number;
  apyBase?: number;
  apyReward?: number;
  tvl: number;
  poolUrl?: string;
  curator?: string;
}

// Stablecoin types (subset of frontend types)
export type StablecoinType =
  | 'USDC'
  | 'USDT'
  | 'DAI'
  | 'PYUSD'
  | 'USDe'
  | 'USDS'
  | 'USD1'
  | 'USDG'
  | 'EURe'
  | 'EURC'
  | 'XAUT'
  | 'PAXG';

// Aleph storage result
export interface AlephUploadResult {
  hash: string;
  success: boolean;
  error?: string;
}
