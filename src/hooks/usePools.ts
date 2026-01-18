import { useState, useEffect, useCallback } from 'react';
import { YieldPool, StablecoinType, FilterState, ProtocolType } from '@/types';
import { fetchAllCustomPools } from '@/utils/customProtocolsApi';

const REFRESH_INTERVAL = 60 * 60 * 1000; // 1 heure (aligné sur DefiLlama)

// ============================================
// 🎛️ CONFIGURATION
// ============================================
const USE_REAL_API = true;
const MIN_SECURITY_SCORE = 65; // Abaissé de 70 à 65 pour inclure plus de pools de qualité
const TOP_POOLS_MIN_SCORE = 80; // Score minimum pour être dans le top 3

// Cache pour optimiser les performances
let poolsCache: { data: YieldPool[] | null; timestamp: number } = {
  data: null,
  timestamp: 0,
};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes de cache

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
  protocols: [],
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
  'DAI': 'DAI',
  'SDAI': 'DAI',
  'PYUSD': 'PYUSD',
  'USDE': 'USDe',
  'USDS': 'USDS',
  'SUSDS': 'USDS', // Sky USDS
  'USD1': 'USD1',
  'USDG': 'USDG',
  'EURE': 'EURe',
  'EUROE': 'EURe',
  'EURC': 'EURC',
  'XAUT': 'XAUT',
  'PAXG': 'PAXG',
};

// Mapping spécial pour les vaults Lagoon dont les symboles ne correspondent pas aux stablecoins standards
// Ces vaults ont des noms custom mais déposent des stablecoins sous-jacents
const LAGOON_VAULT_MAPPING: Record<string, StablecoinType> = {
  // Vaults USDC
  'SYNUSD': 'USDC',
  'SYNUSD+': 'USDC',
  'SYNUSDX': 'USDC',
  'ALUSD': 'USDC',
  'UUSCC--': 'USDC',
  'HUBCAP': 'USDC', // HUBCAP-USDC vault
  'MOONUSDC': 'USDC',
  'GAMIUSDC': 'USDC',
  'GAMISDUSDC': 'USDC',
  'TURTLEAVALANCHEUSDC': 'USDC',
  '9SUSDC': 'USDC',
  'DTUSDC': 'USDC',
  'EXUSDC': 'USDC',
  // Vaults USDT
  'DAMMSTABLE': 'USDT',
  'YIELDUSDT': 'USDT',
  // Autres USD stablecoins
  'MTUSD': 'USDC', // MT USD vault (USDC-backed)
  'TACUSN': 'USDC', // TAC USN vault
  'DTAUSD': 'USDC', // DTA USD vault
  // EUR stablecoins
  'DTEURC': 'EURC',
};

// Logos des stablecoins (CoinGecko / TrustWallet)
export const STABLECOIN_LOGOS: Record<StablecoinType, string> = {
  'USDC': 'https://assets.coingecko.com/coins/images/6319/small/usdc.png',
  'USDT': 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
  'DAI': 'https://assets.coingecko.com/coins/images/9956/small/dai-multi-collateral-mcd.png',
  'PYUSD': 'https://assets.coingecko.com/coins/images/31212/small/PYUSD_Logo_%282%29.png',
  'USDe': '/logos/usde.svg',
  'USDS': '/logos/usds.svg',
  'USD1': '/logos/usd1.png',
  'USDG': '/logos/GDN_USDG_Token.svg',
  'EURe': '/logos/eure.svg',
  'EURC': 'https://assets.coingecko.com/coins/images/26045/small/euro-coin.png',
  'XAUT': 'https://assets.coingecko.com/coins/images/10481/small/Tether_Gold.png',
  'PAXG': 'https://assets.coingecko.com/coins/images/9519/small/paxg.png',
};

// Devise de base pour chaque stablecoin (USD, EUR ou GOLD)
export const STABLECOIN_CURRENCY: Record<StablecoinType, 'USD' | 'EUR' | 'GOLD'> = {
  'USDC': 'USD',
  'USDT': 'USD',
  'DAI': 'USD',
  'PYUSD': 'USD',
  'USDe': 'USD',
  'USDS': 'USD',
  'USD1': 'USD',
  'USDG': 'USD',
  'EURe': 'EUR',
  'EURC': 'EUR',
  'XAUT': 'GOLD',
  'PAXG': 'GOLD',
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
  'Plasma',
  'Stable',
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
  'Linea': '/logos/Linea-Token_Square.svg',
  'Plasma': '/logos/plasma.svg',
  'Stable': 'https://pbs.twimg.com/profile_images/1907025301030486016/Xb2R6I6__400x400.jpg',
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
  'morpho-v1': {
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
    name: 'SparkLend',
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
  'euler-v2': {
    type: 'lending',
    name: 'Euler V2',
    audits: 3,
    launchYear: 2024, // V2 relancé après l'exploit V1
    exploits: 0, // V2 est nouveau, V1 avait l'exploit
    earnUrl: 'https://app.euler.finance/',
    logo: '/logos/euler.svg',
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
  'realtoken-rmm': {
    type: 'lending',
    name: 'RealToken RMM',
    audits: 2,
    launchYear: 2022,
    exploits: 0,
    earnUrl: 'https://rmm.realtoken.network/',
    logo: 'https://realt.co/wp-content/uploads/2023/06/realtoken-symbol-logo.svg',
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
  'venus-core-pool': {
    type: 'lending',
    name: 'Venus',
    audits: 3,
    launchYear: 2020,
    exploits: 1, // Mai 2021 - manipulation oracle
    earnUrl: 'https://app.venus.io/core-pool',
    logo: '/logos/venus.svg',
  },
  'venus': {
    type: 'lending',
    name: 'Venus',
    audits: 3,
    launchYear: 2020,
    exploits: 1, // Mai 2021 - manipulation oracle
    earnUrl: 'https://app.venus.io/core-pool',
    logo: '/logos/venus.svg',
  },
  'sky-lending': {
    type: 'lending',
    name: 'Sky',
    audits: 5,
    launchYear: 2024, // Rebranding de MakerDAO (2017) en 2024
    exploits: 0,
    earnUrl: 'https://info.sky.money/savings',
    logo: '/logos/sky.svg',
  },
  'benqi-lending': {
    type: 'lending',
    name: 'Benqi',
    audits: 2,
    launchYear: 2021,
    exploits: 0,
    earnUrl: 'https://app.benqi.fi/markets',
    logo: '/logos/benqi.png',
  },
  'benqi': {
    type: 'lending',
    name: 'Benqi',
    audits: 2,
    launchYear: 2021,
    exploits: 0,
    earnUrl: 'https://app.benqi.fi/markets',
    logo: '/logos/benqi.png',
  },
  'kamino-lending': {
    type: 'lending',
    name: 'Kamino',
    audits: 2,
    launchYear: 2023,
    exploits: 0,
    earnUrl: 'https://app.kamino.finance/lending',
    logo: '/logos/kamino.svg',
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
  'jupiter-lend': {
    type: 'lending',
    name: 'Jupiter Lend',
    audits: 2,
    launchYear: 2024,
    exploits: 0,
    earnUrl: 'https://jup.ag/lend/earn',
    logo: '/logos/jupiter.svg',
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
  'drift': {
    type: 'lending',
    name: 'Drift',
    audits: 3,
    launchYear: 2021,
    exploits: 0,
    earnUrl: 'https://app.drift.trade/',
    logo: 'https://icons.llama.fi/drift.png',
  },
  'solend': {
    type: 'lending',
    name: 'Solend',
    audits: 2,
    launchYear: 2021,
    exploits: 1,
    earnUrl: 'https://solend.fi/',
    logo: 'https://icons.llama.fi/solend.png',
  },
  'maple': {
    type: 'lending',
    name: 'Maple',
    audits: 3,
    launchYear: 2021,
    exploits: 0,
    earnUrl: 'https://app.maple.finance/',
    logo: 'https://icons.llama.fi/maple.png',
  },
  'cap': {
    type: 'lending',
    name: 'Cap Money',
    audits: 2,
    launchYear: 2024,
    exploits: 0,
    earnUrl: 'https://cap.app/',
    logo: 'https://icons.llama.fi/cap.png',
  },
  'dolomite': {
    type: 'lending',
    name: 'Dolomite',
    audits: 2,
    launchYear: 2022,
    exploits: 0,
    earnUrl: 'https://app.dolomite.io/',
    logo: '/logos/dolomite.png',
  },

  // ========== VAULT MANAGERS ==========
  'lagoon': {
    type: 'vault',
    name: 'Lagoon',
    audits: 2,
    launchYear: 2024,
    exploits: 0,
    earnUrl: 'https://app.lagoon.finance/',
    logo: '/logos/lagoon.ico',
  },
  'wildcat-protocol': {
    type: 'vault',
    name: 'Wildcat',
    audits: 2,
    launchYear: 2024,
    exploits: 0,
    earnUrl: 'https://app.wildcat.finance/',
    logo: '/logos/wildcat.svg',
  },
  'steakhouse': {
    type: 'vault',
    name: 'Steakhouse',
    audits: 2,
    launchYear: 2023,
    exploits: 0,
    earnUrl: 'https://www.steakhouse.financial/',
    logo: '/logos/steakhouse.svg',
  },
  'concrete': {
    type: 'vault',
    name: 'Concrete',
    audits: 2,
    launchYear: 2024,
    exploits: 0,
    earnUrl: 'https://app.concrete.xyz/earn',
    logo: 'https://icons.llama.fi/concrete.png',
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
  // Vérifier le cache
  const now = Date.now();
  if (poolsCache.data && (now - poolsCache.timestamp) < CACHE_TTL) {
    return poolsCache.data;
  }
  const response = await fetch('https://yields.llama.fi/pools');

  if (!response.ok) {
    throw new Error(`Erreur API DefiLlama: ${response.status}`);
  }

  const json = await response.json();
  const pools = json.data || [];

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
      const symbol = pool.symbol?.toUpperCase() || '';

      // Filtrer les pools LP qui contiennent des tokens non-stablecoins (comme UXLINK-USDT)
      if (symbol.includes('-')) {
        // Si le symbole contient un tiret, vérifier que les deux parties sont des stablecoins
        const parts = symbol.split('-');
        const allPartsAreStablecoins = parts.every((part: string) =>
          Object.keys(SUPPORTED_STABLECOINS).some(s => part.includes(s))
        );
        if (!allPartsAreStablecoins) return false;
      }

      const mainSymbol = symbol.split('-')[0] || '';

      // Pour Lagoon, vérifier le mapping spécial
      if (pool.project === 'lagoon' && LAGOON_VAULT_MAPPING[mainSymbol]) {
        // Ce vault Lagoon est mappé à un stablecoin supporté
      } else {
        // Pour les autres protocoles, vérification standard
        const isSupported = Object.keys(SUPPORTED_STABLECOINS).some(s => mainSymbol.includes(s));
        if (!isSupported) return false;
      }
      
      // TVL minimum 100K
      if (pool.tvlUsd < 100_000) return false;
      
      // APY valide (entre 0 et 50%)
      if (!pool.apy || pool.apy <= 0 || pool.apy > 50) return false;
      
      return true;
    })
    .map((pool: any) => transformPool(pool))
    .filter((pool: YieldPool) => pool.securityScore >= MIN_SECURITY_SCORE)
    .sort((a: YieldPool, b: YieldPool) => b.apy - a.apy);

  // Mettre à jour le cache
  poolsCache = {
    data: filteredPools,
    timestamp: Date.now(),
  };

  return filteredPools;
}

/**
 * Transforme un pool DefiLlama brut en format YieldPool
 */
function transformPool(pool: any): YieldPool {
  const symbol = pool.symbol?.toUpperCase()?.split('-')[0] || 'USDC';
  const stablecoin = detectStablecoin(symbol, pool.project);
  const protocol = ALLOWED_PROTOCOLS[pool.project];
  
  if (!protocol) {
    throw new Error(`Protocole non trouvé: ${pool.project}`);
  }
  
  const protocolAge = (new Date().getFullYear() - protocol.launchYear) * 365;
  
  // Calcul du score de sécurité (0-100)
  const auditScore = Math.min(25, protocol.audits * 6);
  const ageScore = protocolAge > 730 ? 25 : protocolAge > 365 ? 20 : protocolAge > 180 ? 12 : 5;
  const tvlScore = pool.tvlUsd > 500_000_000 ? 25 : pool.tvlUsd > 100_000_000 ? 22 : pool.tvlUsd > 10_000_000 ? 18 : pool.tvlUsd > 1_000_000 ? 14 : 10;
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

function detectStablecoin(symbol: string, project?: string): StablecoinType {
  // Vérifier d'abord le mapping Lagoon si c'est un pool Lagoon
  if (project === 'lagoon' && LAGOON_VAULT_MAPPING[symbol]) {
    return LAGOON_VAULT_MAPPING[symbol];
  }

  // Détection standard pour les autres protocoles
  for (const [key, value] of Object.entries(SUPPORTED_STABLECOINS)) {
    if (symbol.includes(key)) return value;
  }

  return 'USDC';
}

// ============================================
// FILTRAGE ET TRI DES POOLS
// ============================================

function filterPools(pools: YieldPool[], filters: FilterState): YieldPool[] {
  return pools.filter(pool => {
    // Filtre par type de protocole
    if (filters.protocols.length > 0 && pool.protocolType && !filters.protocols.includes(pool.protocolType)) {
      return false;
    }

    // Filtre par chaîne
    if (filters.chains.length > 0 && !filters.chains.includes(pool.chain)) {
      return false;
    }

    // Filtre par stablecoin
    if (filters.stablecoins.length > 0 && !filters.stablecoins.includes(pool.stablecoin)) {
      return false;
    }

    // Filtre par APY minimum
    if (pool.apy < filters.minApy) {
      return false;
    }

    // Filtre par TVL minimum
    if (pool.tvl < filters.minTvl) {
      return false;
    }

    // Filtre par score de sécurité minimum
    if (pool.securityScore < filters.minSecurityScore) {
      return false;
    }

    return true;
  });
}

function getTopPools(pools: YieldPool[], count: number = 3): YieldPool[] {
  return pools
    .filter(pool => pool.securityScore >= TOP_POOLS_MIN_SCORE)
    .sort((a, b) => {
      // Tri par score de sécurité d'abord, puis par APY
      if (b.securityScore !== a.securityScore) {
        return b.securityScore - a.securityScore;
      }
      return b.apy - a.apy;
    })
    .slice(0, count);
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
        // Charger d'abord DefiLlama (rapide avec cache)
        data = await fetchFromDefiLlama();

        // Afficher immédiatement les pools DefiLlama
        setPools(data);
        setLastUpdated(new Date());
        setIsLoading(false);

        // Charger les pools personnalisés en arrière-plan (non-bloquant)
        fetchAllCustomPools().then(customPools => {
          // Transformer les pools partiels en pools complets avec scoring de sécurité
          const completeCustomPools: YieldPool[] = customPools.map(pool => {
            // Trouver la config du protocole dans ALLOWED_PROTOCOLS
            const protocolKey = Object.keys(ALLOWED_PROTOCOLS).find(
              key => ALLOWED_PROTOCOLS[key].name === pool.protocol
            );
            const protocolInfo = protocolKey ? ALLOWED_PROTOCOLS[protocolKey] : null;

            if (!protocolInfo) {
              console.warn(`⚠️ Protocole non trouvé dans ALLOWED_PROTOCOLS: ${pool.protocol}`);
              return null;
            }

            // Calculer le score de sécurité (même logique que transformPool)
            const protocolAge = (new Date().getFullYear() - protocolInfo.launchYear) * 365;
            const auditScore = Math.min(25, protocolInfo.audits * 6);
            const ageScore = protocolAge > 730 ? 25 : protocolAge > 365 ? 20 : protocolAge > 180 ? 12 : 5;
            const tvlScore = (pool.tvl || 0) > 500_000_000 ? 25 : (pool.tvl || 0) > 100_000_000 ? 22 : (pool.tvl || 0) > 10_000_000 ? 18 : 10;
            const exploitScore = protocolInfo.exploits === 0 ? 25 : protocolInfo.exploits === 1 ? 12 : 0;
            const securityScore = auditScore + ageScore + tvlScore + exploitScore;

            return {
              ...pool,
              protocolLogo: protocolInfo.logo,
              protocolType: protocolInfo.type,
              chainLogo: CHAIN_LOGOS[pool.chain || ''] || '',
              stablecoinLogo: STABLECOIN_LOGOS[pool.stablecoin as StablecoinType] || '',
              currency: STABLECOIN_CURRENCY[pool.stablecoin as StablecoinType] || 'USD',
              tvlChange24h: 0,
              securityScore,
              audits: protocolInfo.audits,
              protocolAge,
              exploits: protocolInfo.exploits,
              exploitHistory: [],
              poolUrl: pool.poolUrl || protocolInfo.earnUrl,
              lastUpdated: new Date(),
              apyHistory: [],
            } as YieldPool;
          }).filter(pool => pool !== null) as YieldPool[];

          // Combiner avec les pools DefiLlama déjà affichés
          const combinedPools = [...data, ...completeCustomPools];

          // Déduplication: garder seulement les pools uniques basés sur protocol + chain + stablecoin
          const uniquePoolsMap = new Map<string, YieldPool>();

          for (const pool of combinedPools) {
            // Créer une clé unique basée sur protocole, chaîne et stablecoin
            const key = `${pool.protocol}-${pool.chain}-${pool.stablecoin}`.toLowerCase();

            // Si le pool n'existe pas encore, ou si le nouveau pool a un meilleur APY, on le garde
            const existing = uniquePoolsMap.get(key);
            if (!existing || pool.apy > existing.apy) {
              uniquePoolsMap.set(key, pool);
            }
          }

          const finalData = Array.from(uniquePoolsMap.values());

          // Mettre à jour avec les pools combinés
          setPools(finalData);
          setLastUpdated(new Date());
        }).catch(err => {
          console.error('❌ Erreur lors du chargement des pools personnalisés:', err);
          // Les pools DefiLlama sont déjà affichés, donc pas grave si custom pools échouent
        });
      } else {
        // Mode mock data - comportement d'origine
        data = [];
        setPools(data);
        setLastUpdated(new Date());
        setIsLoading(false);
      }
    } catch (err) {
      console.error('❌ Erreur:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      setIsLoading(false);

      if (pools.length === 0) {
        console.error('⚠️ Aucune donnée disponible');
      }
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
