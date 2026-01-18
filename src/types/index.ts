// Types pour les pools de rendement
export type ProtocolType = 'lending' | 'vault';

export interface YieldPool {
  id: string;
  protocol: string;
  protocolLogo: string;
  protocolType?: ProtocolType;
  chain: string;
  chainLogo: string;
  symbol: string; // ex: USDC, USDT, DAI
  stablecoin: StablecoinType;
  stablecoinLogo?: string;
  currency: 'USD' | 'EUR' | 'GOLD'; // Devise de base du stablecoin
  apy: number;
  apyBase: number;
  apyReward: number;
  tvl: number;
  tvlChange24h: number;
  // Données de sécurité
  securityScore: number; // 0-100
  audits: number;
  protocolAge: number; // en jours
  exploits?: number; // nombre d'exploits (0, 1, 2+)
  exploitHistory: ExploitRecord[];
  // Métadonnées
  poolUrl: string;
  lastUpdated: Date;
  // Historique APY (7 derniers jours)
  apyHistory: ApyHistoryPoint[];
}

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

export interface ApyHistoryPoint {
  timestamp: Date;
  apy: number;
}

export interface ExploitRecord {
  date: Date;
  description: string;
  amountLost: number;
  recovered: boolean;
}

// Types pour le score de sécurité
export interface SecurityFactors {
  auditScore: number;      // 0-25 points
  ageScore: number;        // 0-25 points  
  tvlScore: number;        // 0-25 points
  exploitScore: number;    // 0-25 points
  total: number;           // 0-100
}

export type SecurityRating = 
  | 'excellent'  // 80-100
  | 'good'       // 60-79
  | 'moderate'   // 40-59
  | 'risky'      // 20-39
  | 'danger';    // 0-19

// Types pour les filtres
export interface FilterState {
  protocols: ProtocolType[];
  stablecoins: StablecoinType[];
  chains: string[];
  minApy: number;
  minTvl: number;
  minSecurityScore: number;
}

// Types pour le profil utilisateur (recommendation IA)
export interface UserProfile {
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  preferredChains: string[];
  preferredStablecoins: StablecoinType[];
  investmentAmount: number;
}

// Types pour les recommendations
export interface Recommendation {
  pool: YieldPool;
  matchScore: number; // 0-100
  reasons: string[];
}

// Types API DefiLlama
export interface DefiLlamaPool {
  pool: string;
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apy: number;
  apyBase: number;
  apyReward: number;
  stablecoin: boolean;
  ilRisk: string;
  exposure: string;
  poolMeta: string | null;
  underlyingTokens: string[];
  rewardTokens: string[];
}

// Types pour les protocoles avec infos de sécurité
export interface ProtocolInfo {
  name: string;
  slug: string;
  logo: string;
  audits: AuditInfo[];
  launchDate: Date;
  exploits: ExploitRecord[];
  tvl: number;
  category: string;
  chains: string[];
}

export interface AuditInfo {
  auditor: string;
  date: Date;
  reportUrl: string;
}

// Response type pour l'API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  lastUpdated: Date;
  error?: string;
}
