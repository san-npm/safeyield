// ============================================
// Collector Configuration
// ============================================

export const CONFIG = {
  // Data retention
  RETENTION_HOURS: 2160, // 90 days of hourly data

  // API URLs
  DEFILLAMA_API: 'https://yields.llama.fi/pools',
  ALEPH_API: 'https://api2.aleph.im/api/v0',
  ALEPH_STORAGE_URL: 'https://api2.aleph.im/api/v0/storage/raw/',

  // Minimum thresholds
  MIN_TVL: 100_000, // $100K minimum TVL
  MAX_APY: 50, // 50% max APY (filter outliers)

  // Aleph configuration
  ALEPH_CHANNEL: 'yiield-apy-history',

  // Supported chains
  SUPPORTED_CHAINS: [
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
  ],

  // Supported stablecoins
  SUPPORTED_STABLECOINS: {
    'USDC': 'USDC',
    'USDC.E': 'USDC',
    'USDCE': 'USDC',
    'USDT': 'USDT',
    'DAI': 'DAI',
    'SDAI': 'DAI',
    'PYUSD': 'PYUSD',
    'USDE': 'USDe',
    'USDS': 'USDS',
    'SUSDS': 'USDS',
    'USD1': 'USD1',
    'USDG': 'USDG',
    'EURE': 'EURe',
    'EUROE': 'EURe',
    'EURC': 'EURC',
    'XAUT': 'XAUT',
    'PAXG': 'PAXG',
  } as Record<string, string>,

  // Allowed protocols (same as frontend)
  ALLOWED_PROTOCOLS: [
    'aave-v3',
    'aave-v2',
    'compound-v3',
    'morpho-v1',
    'morpho-blue',
    'spark',
    'sparklend',
    'fluid',
    'euler-v2',
    'silo-v2',
    'silo',
    'realtoken-rmm',
    'radiant-v2',
    'venus-core-pool',
    'venus',
    'sky-lending',
    'sky',
    'benqi-lending',
    'benqi',
    'kamino-lending',
    'marginfi',
    'jupiter-lend',
    'ajna',
    'drift',
    'solend',
    'maple',
    'cap',
    'dolomite',
    'lista-dao',
    'lista',
    'lista-lending',
    'lagoon',
    'wildcat-protocol',
    'steakhouse',
    'concrete',
    'veda',
    'mellow',
    'ether.fi',
    'etherfi',
    're7-labs',
    'smokehouse',
    'upshift',
  ],
};
