import { useState, useEffect, useCallback } from 'react';
import { YieldPool, StablecoinType, FilterState, ProtocolType } from '@/types';
import { MOCK_POOLS, filterPools, getTopPools } from '@/data/mockPools';

const REFRESH_INTERVAL = 60 * 60 * 1000; // 1 heure (aligné sur DefiLlama)

// ============================================
// 🎛️ CONFIGURATION
// ============================================
const USE_REAL_API = true;
const MIN_SECURITY_SCORE = 70;

interface UsePoolsReturn {
  pools: YieldPool[];
  topPools: YieldPool[];
  filteredPools: YieldPool[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  filters: FilterState;
  setFilters: (filters: Partial<FilterState>) => void;
  refresh: () => Promise<void>;
}

const defaultFilters: FilterState = {
  stablecoins: [],
  chains: [],
  minApy: 0,
  minTvl: 0,
  minSecurityScore: 0,
};

// ============================================
// 📊 STABLECOINS SUPPORTÉS
// ============================================
const SUPPORTED_STABLECOINS: Record<string, StablecoinType> = {
  'USDC': 'USDC',
  'USDC.E': 'USDC',
  'USDCE': 'USDC',
  'USDT': 'USDT',
  'USDT0': 'USDT0',
  'DAI': 'DAI',
  'SDAI': 'DAI',
  'USDS': 'USDS',
  'SUSDS': 'USDS',
  'PYUSD': 'PYUSD',
  'EURE': 'EURe',
  'EUROE': 'EURe',
  'EURC': 'EURC',
};

// Logos des stablecoins (CoinGecko / TrustWallet)
export const STABLECOIN_LOGOS: Record<StablecoinType, string> = {
  'USDC': 'https://assets.coingecko.com/coins/images/6319/small/usdc.png',
  'USDT': 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
  'USDT0': 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
  'DAI': 'https://assets.coingecko.com/coins/images/9956/small/dai-multi-collateral-mcd.png',
  'USDS': 'https://assets.coingecko.com/coins/images/39926/small/usds.webp',
  'PYUSD': 'https://assets.coingecko.com/coins/images/31212/small/PYUSD_Logo_%282%29.png',
  'EURe': 'https://assets.coingecko.com/coins/images/23354/standard/eure.png',
  'EURC': 'https://assets.coingecko.com/coins/images/26045/small/euro-coin.png',
};

// Devise de base pour chaque stablecoin (USD ou EUR)
export const STABLECOIN_CURRENCY: Record<StablecoinType, 'USD' | 'EUR'> = {
  'USDC': 'USD',
  'USDT': 'USD',
  'USDT0': 'USD',
  'DAI': 'USD',
  'USDS': 'USD',
  'PYUSD': 'USD',
  'EURe': 'EUR',
  'EURC': 'EUR',
};

// ============================================
// 🔗 CHAÎNES SUPPORTÉES
// ============================================
const SUPPORTED_CHAINS = [
  'Ethereum',
  'Arbitrum',
  'Optimism',
  'Base',
  'Polygon',
  'BSC',
  'Avalanche',
  'Solana',
  'Gnosis',
  'Linea',
];

// Logos des chaînes - Sources multiples avec fallbacks
export const CHAIN_LOGOS: Record<string, string> = {
  'Ethereum': 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
  'Arbitrum': 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/info/logo.png',
  'Optimism': 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/optimism/info/logo.png',
  'Base': 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/base/info/logo.png',
  'Polygon': 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png',
  'BSC': 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/info/logo.png',
  'Avalanche': 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchec/info/logo.png',
  'Solana': 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png',
  'Gnosis': 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/xdai/info/logo.png',
  'Linea': 'https://assets.coingecko.com/coins/images/33286/small/linea-logo.png',
};

// ============================================
// 🏦 PROTOCOLES AUTORISÉS (Lending + Vault Managers)
// ============================================

interface ProtocolInfo {
  type: ProtocolType;
  name: string;
  audits: number;
  launchYear: number;
  exploits: number;
  excludedDueToExploit?: boolean; // true = exploit majeur non remboursé
  earnUrl: string;
  logo: string;
}

const ALLOWED_PROTOCOLS: Record<string, ProtocolInfo> = {
  // ========== LENDING PROTOCOLS ==========
  'aave-v3': {
    type: 'lending',
    name: 'Aave V3',
    audits: 5,
    launchYear: 2022,
    exploits: 0,
    earnUrl: 'https://app.aave.com/',
    logo: 'https://icons.llama.fi/aave-v3.png',
  },
  'aave-v2': {
    type: 'lending',
    name: 'Aave V2',
    audits: 4,
    launchYear: 2020,
    exploits: 0,
    earnUrl: 'https://app.aave.com/',
    logo: 'https://icons.llama.fi/aave-v2.png',
  },
  'compound-v3': {
    type: 'lending',
    name: 'Compound V3',
    audits: 3,
    launchYear: 2022,
    exploits: 0,
    earnUrl: 'https://app.compound.finance/markets',
    logo: 'https://icons.llama.fi/compound-v3.png',
  },
  'morpho': {
    type: 'lending',
    name: 'Morpho',
    audits: 3,
    launchYear: 2022,
    exploits: 0,
    earnUrl: 'https://app.morpho.org/',
    logo: 'https://icons.llama.fi/morpho.png',
  },
  'morpho-blue': {
    type: 'lending',
    name: 'Morpho Blue',
    audits: 3,
    launchYear: 2024,
    exploits: 0,
    earnUrl: 'https://app.morpho.org/',
    logo: 'https://icons.llama.fi/morpho-blue.png',
  },
  'spark': {
    type: 'lending',
    name: 'Spark',
    audits: 3,
    launchYear: 2023,
    exploits: 0,
    earnUrl: 'https://app.spark.fi/',
    logo: 'https://icons.llama.fi/spark.png',
  },
  'fluid': {
    type: 'lending',
    name: 'Fluid',
    audits: 2,
    launchYear: 2024,
    exploits: 0,
    earnUrl: 'https://fluid.instadapp.io/lending',
    logo: 'https://icons.llama.fi/fluid.png',
  },
  'euler': {
    type: 'lending',
    name: 'Euler V2',
    audits: 3,
    launchYear: 2024, // V2 relancé après l'exploit V1
    exploits: 0, // V2 est nouveau, V1 avait l'exploit
    earnUrl: 'https://app.euler.finance/',
    logo: 'https://icons.llama.fi/euler.png',
  },
  'silo-v2': {
    type: 'lending',
    name: 'Silo V2',
    audits: 2,
    launchYear: 2024,
    exploits: 0,
    earnUrl: 'https://app.silo.finance/',
    logo: 'https://icons.llama.fi/silo-v2.png',
  },
  'silo': {
    type: 'lending',
    name: 'Silo',
    audits: 2,
    launchYear: 2022,
    exploits: 0,
    earnUrl: 'https://app.silo.finance/',
    logo: 'https://icons.llama.fi/silo.png',
  },
  'radiant-v2': {
    type: 'lending',
    name: 'Radiant V2',
    audits: 2,
    launchYear: 2023,
    exploits: 1, // Janvier 2024 - $4.5M exploit
    earnUrl: 'https://app.radiant.capital/',
    logo: 'https://icons.llama.fi/radiant-v2.png',
  },
  'venus': {
    type: 'lending',
    name: 'Venus',
    audits: 3,
    launchYear: 2020,
    exploits: 1, // Mai 2021 - manipulation oracle
    earnUrl: 'https://app.venus.io/core-pool',
    logo: 'https://icons.llama.fi/venus.png',
  },
  'benqi-lending': {
    type: 'lending',
    name: 'Benqi',
    audits: 2,
    launchYear: 2021,
    exploits: 0,
    earnUrl: 'https://app.benqi.fi/markets',
    logo: 'https://assets.coingecko.com/coins/images/16065/small/benqi.png',
  },
  'benqi': {
    type: 'lending',
    name: 'Benqi',
    audits: 2,
    launchYear: 2021,
    exploits: 0,
    earnUrl: 'https://app.benqi.fi/markets',
    logo: 'https://assets.coingecko.com/coins/images/16065/small/benqi.png',
  },
  'kamino-lending': {
    type: 'lending',
    name: 'Kamino',
    audits: 2,
    launchYear: 2023,
    exploits: 0,
    earnUrl: 'https://app.kamino.finance/lending',
    logo: 'https://icons.llama.fi/kamino-lending.png',
  },
  'marginfi': {
    type: 'lending',
    name: 'MarginFi',
    audits: 2,
    launchYear: 2022,
    exploits: 0,
    earnUrl: 'https://app.marginfi.com/',
    logo: 'https://icons.llama.fi/marginfi.png',
  },
  'ajna': {
    type: 'lending',
    name: 'Ajna',
    audits: 3,
    launchYear: 2023,
    exploits: 0,
    earnUrl: 'https://app.ajna.finance/',
    logo: 'https://icons.llama.fi/ajna.png',
  },

  // ========== VAULT MANAGERS ==========
  'lagoon': {
    type: 'vault',
    name: 'Lagoon',
    audits: 2,
    launchYear: 2024,
    exploits: 0,
    earnUrl: 'https://app.lagoon.finance/',
    logo: 'https://pbs.twimg.com/profile_images/1729106339597271040/HnIxAGzf_400x400.jpg',
  },
  'wildcat': {
    type: 'vault',
    name: 'Wildcat',
    audits: 2,
    launchYear: 2024,
    exploits: 0,
    earnUrl: 'https://app.wildcat.finance/',
    logo: 'https://icons.llama.fi/wildcat.png',
  },
  'steakhouse': {
    type: 'vault',
    name: 'Steakhouse',
    audits: 2,
    launchYear: 2023,
    exploits: 0,
    earnUrl: 'https://www.steakhouse.financial/',
    logo: 'https://icons.llama.fi/steakhouse.png',
  },
  'veda': {
    type: 'vault',
    name: 'Veda',
    audits: 2,
    launchYear: 2024,
    exploits: 0,
    earnUrl: 'https://www.veda.tech/',
    logo: 'https://icons.llama.fi/veda.png',
  },
  'mellow': {
    type: 'vault',
    name: 'Mellow',
    audits: 2,
    launchYear: 2024,
    exploits: 0,
    earnUrl: 'https://app.mellow.finance/',
    logo: 'https://icons.llama.fi/mellow.png',
  },
  'ether.fi': {
    type: 'vault',
    name: 'Ether.fi',
    audits: 3,
    launchYear: 2023,
    exploits: 0,
    earnUrl: 'https://app.ether.fi/',
    logo: 'https://icons.llama.fi/ether.fi.png',
  },
  'etherfi': {
    type: 'vault',
    name: 'Ether.fi',
    audits: 3,
    launchYear: 2023,
    exploits: 0,
    earnUrl: 'https://app.ether.fi/',
    logo: 'https://icons.llama.fi/ether.fi.png',
  },
  're7-labs': {
    type: 'vault',
    name: 'Re7 Labs',
    audits: 2,
    launchYear: 2024,
    exploits: 0,
    earnUrl: 'https://www.re7.capital/',
    logo: 'https://icons.llama.fi/re7-labs.png',
  },
  'smokehouse': {
    type: 'vault',
    name: 'Smokehouse',
    audits: 1,
    launchYear: 2024,
    exploits: 0,
    earnUrl: 'https://smokehouse.finance/',
    logo: 'https://icons.llama.fi/smokehouse.png',
  },
  
  // ========== EXCLUS (exploit majeur non remboursé) ==========
  'euler-v1': {
    type: 'lending',
    name: 'Euler V1',
    audits: 2,
    launchYear: 2021,
    exploits: 1,
    excludedDueToExploit: true, // $197M - Mars 2023 (remboursé mais V1 fermé)
    earnUrl: '',
    logo: 'https://icons.llama.fi/euler.png',
  },
  'solend': {
    type: 'lending',
    name: 'Solend',
    audits: 2,
    launchYear: 2021,
    exploits: 2,
    excludedDueToExploit: true, // Multiples incidents de gouvernance + oracle
    earnUrl: '',
    logo: 'https://icons.llama.fi/solend.png',
  },
  'agave': {
    type: 'lending',
    name: 'Agave',
    audits: 2,
    launchYear: 2021,
    exploits: 1,
    excludedDueToExploit: true, // $5.5M - Mars 2022 (non remboursé)
    earnUrl: '',
    logo: 'https://icons.llama.fi/agave.png',
  },
};

/**
 * 🌐 Récupère les pools depuis l'API DefiLlama (GRATUITE)
 * Filtre : uniquement Lending + Vault Managers
 */
async function fetchFromDefiLlama(): Promise<YieldPool[]> {
  const response = await fetch('https://yields.llama.fi/pools');
  
  if (!response.ok) {
    throw new Error(`Erreur API DefiLlama: ${response.status}`);
  }
  
  const json = await response.json();
  const pools = json.data || [];
  
  console.log(`📊 DefiLlama: ${pools.length} pools totaux reçus`);
  
  // Filtrer et transformer les données
  const filteredPools = pools
    .filter((pool: any) => {
      // Vérifier si le protocole est dans notre liste autorisée
      const protocol = ALLOWED_PROTOCOLS[pool.project];
      if (!protocol) return false;
      
      // Exclure les protocoles avec exploit majeur non remboursé
      if (protocol.excludedDueToExploit) return false;
      
      // Seulement les stablecoins
      if (!pool.stablecoin) return false;
      
      // Seulement les chaînes supportées
      if (!SUPPORTED_CHAINS.includes(pool.chain)) return false;
      
      // Seulement les stablecoins supportés
      const symbol = pool.symbol?.toUpperCase()?.split('-')[0] || '';
      const isSupported = Object.keys(SUPPORTED_STABLECOINS).some(s => symbol.includes(s));
      if (!isSupported) return false;
      
      // TVL minimum 100K
      if (pool.tvlUsd < 100_000) return false;
      
      // APY valide (entre 0 et 50%)
      if (!pool.apy || pool.apy <= 0 || pool.apy > 50) return false;
      
      return true;
    })
    .map((pool: any) => transformPool(pool))
    .filter((pool: YieldPool) => pool.securityScore >= MIN_SECURITY_SCORE)
    .sort((a: YieldPool, b: YieldPool) => b.apy - a.apy)
    .slice(0, 100);
  
  console.log(`✅ ${filteredPools.length} pools (Lending + Vault Managers) avec score ≥ ${MIN_SECURITY_SCORE}`);
  
  return filteredPools;
}

/**
 * Transforme un pool DefiLlama brut en format YieldPool
 */
function transformPool(pool: any): YieldPool {
  const symbol = pool.symbol?.toUpperCase()?.split('-')[0] || 'USDC';
  const stablecoin = detectStablecoin(symbol);
  const protocol = ALLOWED_PROTOCOLS[pool.project];
  
  if (!protocol) {
    throw new Error(`Protocole non trouvé: ${pool.project}`);
  }
  
  const protocolAge = (new Date().getFullYear() - protocol.launchYear) * 365;
  
  // Calcul du score de sécurité (0-100)
  const auditScore = Math.min(25, protocol.audits * 6);
  const ageScore = protocolAge > 730 ? 25 : protocolAge > 365 ? 20 : protocolAge > 180 ? 12 : 5;
  const tvlScore = pool.tvlUsd > 500_000_000 ? 25 : pool.tvlUsd > 100_000_000 ? 22 : pool.tvlUsd > 10_000_000 ? 18 : 10;
  const exploitScore = protocol.exploits === 0 ? 25 : protocol.exploits === 1 ? 12 : 0;
  const securityScore = auditScore + ageScore + tvlScore + exploitScore;
  
  return {
    id: pool.pool,
    protocol: protocol.name,
    protocolLogo: protocol.logo,
    protocolType: protocol.type,
    chain: pool.chain,
    chainLogo: CHAIN_LOGOS[pool.chain] || '',
    symbol: pool.symbol,
    stablecoin,
    stablecoinLogo: STABLECOIN_LOGOS[stablecoin] || '',
    currency: STABLECOIN_CURRENCY[stablecoin] || 'USD',
    apy: pool.apy,
    apyBase: pool.apyBase || pool.apy,
    apyReward: pool.apyReward || 0,
    tvl: pool.tvlUsd,
    tvlChange24h: 0,
    securityScore,
    audits: protocol.audits,
    protocolAge,
    exploits: protocol.exploits,
    exploitHistory: [],
    poolUrl: protocol.earnUrl,
    lastUpdated: new Date(),
    apyHistory: [],
  };
}

function detectStablecoin(symbol: string): StablecoinType {
  for (const [key, value] of Object.entries(SUPPORTED_STABLECOINS)) {
    if (symbol.includes(key)) return value;
  }
  return 'USDC';
}

// ============================================
// 🎣 HOOK PRINCIPAL
// ============================================

export function usePools(): UsePoolsReturn {
  const [pools, setPools] = useState<YieldPool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [filters, setFiltersState] = useState<FilterState>(defaultFilters);

  const fetchPools = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      let data: YieldPool[];
      
      if (USE_REAL_API) {
        // ====== 🌐 MODE API RÉELLE ======
        console.log('🔄 Chargement des données depuis DefiLlama...');
        data = await fetchFromDefiLlama();
      } else {
        // ====== 🎭 MODE DEMO (données mock) ======
        console.log('🎭 Mode démo - utilisation des données fictives');
        await new Promise(resolve => setTimeout(resolve, 500));
        data = MOCK_POOLS.map(pool => ({
          ...pool,
          apy: pool.apy * (1 + (Math.random() - 0.5) * 0.02),
          tvl: pool.tvl * (1 + (Math.random() - 0.5) * 0.01),
          lastUpdated: new Date(),
        }));
      }
      
      setPools(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('❌ Erreur:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      
      // Fallback vers données mock en cas d'erreur API
      if (USE_REAL_API && pools.length === 0) {
        console.log('⚠️ Fallback vers données de démonstration');
        setPools(MOCK_POOLS);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Chargement initial
  useEffect(() => {
    fetchPools();
  }, [fetchPools]);

  // Auto-refresh toutes les 10 minutes
  useEffect(() => {
    const interval = setInterval(fetchPools, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchPools]);

  const setFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  const filteredPools = filterPools(pools, filters);
  const topPools = getTopPools(pools, 3);

  return {
    pools,
    topPools,
    filteredPools,
    isLoading,
    error,
    lastUpdated,
    filters,
    setFilters,
    refresh: fetchPools,
  };
}

// Hook pour les statistiques globales
export function useStats(pools: YieldPool[]) {
  const totalTvl = pools.reduce((sum, pool) => sum + pool.tvl, 0);
  const avgApy = pools.length > 0 
    ? pools.reduce((sum, pool) => sum + pool.apy, 0) / pools.length 
    : 0;
  const avgSecurity = pools.length > 0
    ? pools.reduce((sum, pool) => sum + pool.securityScore, 0) / pools.length
    : 0;
  const poolCount = pools.length;
  const protocolCount = new Set(pools.map(p => p.protocol)).size;
  const chainCount = new Set(pools.map(p => p.chain)).size;

  return {
    totalTvl,
    avgApy,
    avgSecurity,
    poolCount,
    protocolCount,
    chainCount,
  };
}
