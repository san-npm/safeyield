import { YiieldProtocolInfo } from '@/types/yiieldScore';

// Database of protocol information for Yiield Score calculation
// This is where we store the due diligence data for each protocol

export const YIIELD_PROTOCOLS: Record<string, YiieldProtocolInfo> = {
  // === TIER 1 PROTOCOLS (95+ Security Score) ===

  'aave-v3': {
    name: 'Aave V3',
    slug: 'aave-v3',
    teamStatus: 'doxxed',
    teamDescription: 'Led by Stani Kulechov, public team since 2017',
    auditors: [
      { name: 'OpenZeppelin', tier: 1, reportUrl: 'https://github.com/aave/aave-v3-core/tree/master/audits' },
      { name: 'Trail of Bits', tier: 1, reportUrl: 'https://github.com/aave/aave-v3-core/tree/master/audits' },
      { name: 'Sigma Prime', tier: 1 },
      { name: 'PeckShield', tier: 2 },
      { name: 'ABDK', tier: 2 },
    ],
    insurance: {
      provider: 'Nexus Mutual',
      coverage: 50_000_000,
      url: 'https://app.nexusmutual.io/cover/buy/get-quote?address=0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2',
    },
    governance: {
      hasGovernance: true,
      governanceType: 'dao',
      description: 'AAVE token holders govern protocol',
    },
  },

  'aave-v2': {
    name: 'Aave V2',
    slug: 'aave-v2',
    teamStatus: 'doxxed',
    teamDescription: 'Same team as Aave V3',
    auditors: [
      { name: 'OpenZeppelin', tier: 1 },
      { name: 'Trail of Bits', tier: 1 },
      { name: 'Consensys Diligence', tier: 1 },
    ],
    insurance: {
      provider: 'Nexus Mutual',
      coverage: 30_000_000,
      url: 'https://app.nexusmutual.io/cover/buy/get-quote?address=0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9',
    },
    governance: {
      hasGovernance: true,
      governanceType: 'dao',
    },
  },

  'compound-v3': {
    name: 'Compound V3',
    slug: 'compound-v3',
    teamStatus: 'doxxed',
    teamDescription: 'Founded by Robert Leshner, public team',
    auditors: [
      { name: 'OpenZeppelin', tier: 1 },
      { name: 'ChainSecurity', tier: 1 },
      { name: 'Certora', tier: 2 },
    ],
    insurance: {
      provider: 'Nexus Mutual',
      coverage: 20_000_000,
    },
    governance: {
      hasGovernance: true,
      governanceType: 'dao',
      description: 'COMP token governance',
    },
  },

  // === MORPHO ECOSYSTEM ===

  'morpho': {
    name: 'Morpho',
    slug: 'morpho',
    teamStatus: 'doxxed',
    teamDescription: 'Led by Paul Frambot, Merlin Egalite, Mathis Gontier Delaunay',
    auditors: [
      { name: 'Spearbit', tier: 1, reportUrl: 'https://docs.morpho.org/get-started/resources/audits/' },
      { name: 'ChainSecurity', tier: 1 },
      { name: 'OpenZeppelin', tier: 1 },
      { name: 'Trail of Bits', tier: 1 },
      { name: 'Certora', tier: 2 },
      { name: 'Cantina', tier: 2 },
      { name: 'Zellic', tier: 2 },
      { name: 'ABDK', tier: 2 },
      { name: 'Omniscia', tier: 3 },
    ],
    insurance: {
      provider: 'Nexus Mutual',
      coverage: 10_000_000,
    },
    governance: {
      hasGovernance: true,
      governanceType: 'dao',
    },
  },

  'morpho-blue': {
    name: 'Morpho Blue',
    slug: 'morpho-blue',
    teamStatus: 'doxxed',
    teamDescription: 'Same team as Morpho',
    auditors: [
      { name: 'Spearbit', tier: 1, reportUrl: 'https://docs.morpho.org/get-started/resources/audits/' },
      { name: 'ChainSecurity', tier: 1 },
      { name: 'OpenZeppelin', tier: 1 },
      { name: 'Certora', tier: 2 },
      { name: 'Cantina', tier: 2 },
      { name: 'Zellic', tier: 2 },
    ],
    insurance: {
      provider: 'Nexus Mutual',
      coverage: 15_000_000,
    },
    governance: {
      hasGovernance: true,
      governanceType: 'dao',
    },
  },

  // === MAKER/SKY ECOSYSTEM ===

  'sky': {
    name: 'Sky',
    slug: 'sky',
    teamStatus: 'doxxed',
    teamDescription: 'Rebranded from MakerDAO, led by Rune Christensen',
    auditors: [
      { name: 'ChainSecurity', tier: 1 },
      { name: 'Trail of Bits', tier: 1 },
      { name: 'OpenZeppelin', tier: 1 },
    ],
    insurance: {
      provider: 'Nexus Mutual',
      coverage: 30_000_000,
    },
    governance: {
      hasGovernance: true,
      governanceType: 'dao',
      description: 'SKY token governance (formerly MKR)',
    },
  },

  'sparklend': {
    name: 'SparkLend',
    slug: 'sparklend',
    teamStatus: 'doxxed',
    teamDescription: 'Part of Sky ecosystem (formerly MakerDAO)',
    auditors: [
      { name: 'ChainSecurity', tier: 1, reportUrl: 'https://docs.spark.fi/dev/security/security-and-audits' },
      { name: 'Cantina', tier: 2 },
    ],
    governance: {
      hasGovernance: true,
      governanceType: 'dao',
      description: 'Governed by Sky DAO',
    },
    notes: 'Based on Aave V3 codebase which has extensive audits',
  },

  'spark-savings': {
    name: 'Spark Savings',
    slug: 'spark-savings',
    teamStatus: 'doxxed',
    teamDescription: 'Part of Sky ecosystem (formerly MakerDAO)',
    auditors: [
      { name: 'ChainSecurity', tier: 1, reportUrl: 'https://docs.spark.fi/dev/security/security-and-audits' },
      { name: 'Cantina', tier: 2 },
    ],
    governance: {
      hasGovernance: true,
      governanceType: 'dao',
      description: 'Governed by Sky DAO',
    },
  },

  'spark': {
    name: 'SparkLend',
    slug: 'spark',
    teamStatus: 'doxxed',
    teamDescription: 'Part of Sky ecosystem (formerly MakerDAO)',
    auditors: [
      { name: 'ChainSecurity', tier: 1, reportUrl: 'https://docs.spark.fi/dev/security/security-and-audits' },
      { name: 'Cantina', tier: 2 },
    ],
    governance: {
      hasGovernance: true,
      governanceType: 'dao',
      description: 'Governed by Sky DAO',
    },
    notes: 'Based on Aave V3 codebase which has extensive audits',
  },

  // === ESTABLISHED PROTOCOLS ===

  'fluid': {
    name: 'Fluid',
    slug: 'fluid',
    teamStatus: 'doxxed',
    teamDescription: 'Built by Instadapp team',
    auditors: [
      { name: 'PeckShield', tier: 2, reportUrl: 'https://docs.fluid.instadapp.io/audits-and-security.html' },
      { name: 'MixBytes', tier: 2 },
      { name: 'Cantina', tier: 2 },
      { name: 'Statemind', tier: 3 },
    ],
    governance: {
      hasGovernance: false,
    },
  },

  'euler-v2': {
    name: 'Euler V2',
    slug: 'euler-v2',
    teamStatus: 'doxxed',
    auditors: [
      { name: 'Spearbit', tier: 1 },
      { name: 'Certora', tier: 2 },
    ],
    governance: {
      hasGovernance: true,
      governanceType: 'dao',
    },
  },

  'silo-v2': {
    name: 'Silo V2',
    slug: 'silo-v2',
    teamStatus: 'doxxed',
    auditors: [
      { name: 'Quantstamp', tier: 2 },
    ],
    governance: {
      hasGovernance: true,
      governanceType: 'dao',
    },
  },

  'venus': {
    name: 'Venus',
    slug: 'venus',
    teamStatus: 'doxxed',
    auditors: [
      { name: 'Certik', tier: 2 },
      { name: 'PeckShield', tier: 2 },
      { name: 'Hacken', tier: 3 },
    ],
    governance: {
      hasGovernance: true,
      governanceType: 'dao',
    },
  },

  'benqi': {
    name: 'Benqi',
    slug: 'benqi',
    teamStatus: 'doxxed',
    auditors: [
      { name: 'Halborn', tier: 2 },
    ],
    governance: {
      hasGovernance: true,
      governanceType: 'dao',
    },
  },

  'lista-lending': {
    name: 'Lista DAO',
    slug: 'lista-lending',
    teamStatus: 'doxxed',
    teamDescription: 'Founded by Terry, public team',
    auditors: [
      { name: 'PeckShield', tier: 2 },
      { name: 'SlowMist', tier: 2 },
      { name: 'Certik', tier: 2 },
    ],
    governance: {
      hasGovernance: true,
      governanceType: 'dao',
      description: 'LISTA token governance',
    },
  },

  'lista-dao': {
    name: 'Lista DAO',
    slug: 'lista-dao',
    teamStatus: 'doxxed',
    teamDescription: 'Founded by Terry, public team',
    auditors: [
      { name: 'PeckShield', tier: 2 },
      { name: 'SlowMist', tier: 2 },
      { name: 'Certik', tier: 2 },
    ],
    governance: {
      hasGovernance: true,
      governanceType: 'dao',
      description: 'LISTA token governance',
    },
  },

  'lista': {
    name: 'Lista DAO',
    slug: 'lista',
    teamStatus: 'doxxed',
    teamDescription: 'Founded by Terry, public team',
    auditors: [
      { name: 'PeckShield', tier: 2 },
      { name: 'SlowMist', tier: 2 },
      { name: 'Certik', tier: 2 },
    ],
    governance: {
      hasGovernance: true,
      governanceType: 'dao',
      description: 'LISTA token governance',
    },
  },

  // === SOLANA ECOSYSTEM ===

  'kamino': {
    name: 'Kamino',
    slug: 'kamino',
    teamStatus: 'doxxed',
    auditors: [
      { name: 'Trail of Bits', tier: 1, reportUrl: 'https://github.com/Kamino-Finance/audits' },
      { name: 'OtterSec', tier: 2 },
      { name: 'Certora', tier: 2 },
    ],
    governance: {
      hasGovernance: false,
    },
    notes: 'Formal verification with Certora, zero exploits since launch',
  },

  'marginfi': {
    name: 'MarginFi',
    slug: 'marginfi',
    teamStatus: 'anonymous',
    auditors: [
      { name: 'OtterSec', tier: 2 },
    ],
    governance: {
      hasGovernance: false,
    },
  },

  'jupiter-lend': {
    name: 'Jupiter Lend',
    slug: 'jupiter-lend',
    teamStatus: 'doxxed',
    teamDescription: 'Built by Jupiter team (Meow, public)',
    auditors: [
      { name: 'OtterSec', tier: 2 },
      { name: 'Offside Labs', tier: 3 },
    ],
    governance: {
      hasGovernance: false,
    },
  },

  'drift': {
    name: 'Drift',
    slug: 'drift',
    teamStatus: 'doxxed',
    auditors: [
      { name: 'OtterSec', tier: 2 },
    ],
    governance: {
      hasGovernance: false,
    },
  },

  'solend': {
    name: 'Solend',
    slug: 'solend',
    teamStatus: 'anonymous',
    auditors: [
      { name: 'OtterSec', tier: 2 },
    ],
    governance: {
      hasGovernance: true,
      governanceType: 'dao',
    },
  },

  // === CREDIT MARKETS ===

  'maple': {
    name: 'Maple',
    slug: 'maple',
    teamStatus: 'doxxed',
    auditors: [
      { name: 'Trail of Bits', tier: 1 },
    ],
    governance: {
      hasGovernance: true,
      governanceType: 'dao',
    },
  },

  'lagoon': {
    name: 'Lagoon',
    slug: 'lagoon',
    teamStatus: 'verified',
    teamDescription: 'Verified by Yiield team',
    auditors: [
      { name: 'Nethermind Security', tier: 2, reportUrl: 'https://docs.lagoon.finance/resources/audits' },
    ],
    governance: {
      hasGovernance: false,
    },
    notes: 'Multiple Nethermind audits from v0.1.0 to v0.5.1',
  },

  'wildcat': {
    name: 'Wildcat',
    slug: 'wildcat',
    teamStatus: 'verified',
    teamDescription: 'Verified by Yiield team',
    auditors: [
      { name: 'Code4rena', tier: 3, reportUrl: 'https://code4rena.com/reports/2023-10-wildcat' },
    ],
    governance: {
      hasGovernance: false,
    },
    notes: 'Code4rena audits in Oct 2023 ($60.5K) and Aug 2024 ($100K)',
  },

  // === VAULT MANAGERS ===

  'steakhouse': {
    name: 'Steakhouse',
    slug: 'steakhouse',
    teamStatus: 'doxxed',
    teamDescription: 'Founded by Sébastien Derivaux',
    auditors: [
      { name: 'ChainSecurity', tier: 1 },
    ],
    governance: {
      hasGovernance: false,
    },
  },

  'concrete': {
    name: 'Concrete',
    slug: 'concrete',
    teamStatus: 'doxxed',
    auditors: [
      { name: 'Cyfrin', tier: 2 },
    ],
    governance: {
      hasGovernance: false,
    },
  },

  'veda': {
    name: 'Veda',
    slug: 'veda',
    teamStatus: 'doxxed',
    auditors: [
      { name: 'Certik', tier: 2 },
    ],
    governance: {
      hasGovernance: false,
    },
  },

  'radiant-v2': {
    name: 'Radiant V2',
    slug: 'radiant-v2',
    teamStatus: 'anonymous',
    auditors: [
      { name: 'PeckShield', tier: 2 },
      { name: 'Blocksec', tier: 2 },
    ],
    governance: {
      hasGovernance: true,
      governanceType: 'dao',
    },
  },

  'ajna': {
    name: 'Ajna',
    slug: 'ajna',
    teamStatus: 'doxxed',
    auditors: [
      { name: 'Sherlock', tier: 3 },
    ],
    governance: {
      hasGovernance: true,
      governanceType: 'dao',
    },
  },

  'cap-money': {
    name: 'Cap Money',
    slug: 'cap-money',
    teamStatus: 'verified',
    teamDescription: 'Verified by Yiield team',
    auditors: [
      { name: 'Sherlock', tier: 3 },
    ],
    governance: {
      hasGovernance: false,
    },
  },

  'cap': {
    name: 'Cap Money',
    slug: 'cap',
    teamStatus: 'verified',
    teamDescription: 'Verified by Yiield team',
    auditors: [
      { name: 'Sherlock', tier: 3 },
    ],
    governance: {
      hasGovernance: false,
    },
  },

  'dolomite': {
    name: 'Dolomite',
    slug: 'dolomite',
    teamStatus: 'doxxed',
    auditors: [
      { name: 'Quantstamp', tier: 2 },
    ],
    governance: {
      hasGovernance: false,
    },
  },

  'mellow': {
    name: 'Mellow',
    slug: 'mellow',
    teamStatus: 'doxxed',
    auditors: [
      { name: 'MixBytes', tier: 2 },
    ],
    governance: {
      hasGovernance: false,
    },
  },

  'upshift': {
    name: 'Upshift',
    slug: 'upshift',
    teamStatus: 'doxxed',
    teamDescription: 'Founded by experienced DeFi builders',
    auditors: [
      { name: 'Halborn', tier: 2 },
      { name: 'Certik', tier: 2 },
    ],
    governance: {
      hasGovernance: false,
    },
  },
};

// Protocol name aliases for matching
const PROTOCOL_ALIASES: Record<string, string> = {
  'aave v3': 'aave-v3',
  'aave v2': 'aave-v2',
  'compound v3': 'compound-v3',
  'morpho blue': 'morpho-blue',
  'morpho': 'morpho',
  'euler v2': 'euler-v2',
  'silo v2': 'silo-v2',
  'jupiter lend': 'jupiter-lend',
  'cap money': 'cap',
  'lista dao': 'lista-dao',
  'radiant v2': 'radiant-v2',
  'spark savings': 'spark-savings',
  'kamino': 'kamino',
  'fluid': 'fluid',
  'venus': 'venus',
  'benqi': 'benqi',
  'marginfi': 'marginfi',
  'drift': 'drift',
  'solend': 'solend',
  'maple': 'maple',
  'lagoon': 'lagoon',
  'wildcat': 'wildcat',
  'steakhouse': 'steakhouse',
  'concrete': 'concrete',
  'veda': 'veda',
  'mellow': 'mellow',
  'upshift': 'upshift',
  'dolomite': 'dolomite',
  'ajna': 'ajna',
  'sky': 'sky',
  'sparklend': 'sparklend',
};

// Helper function to get protocol info by name (case-insensitive, handles variations)
export function getProtocolInfo(protocolName: string): YiieldProtocolInfo | undefined {
  const normalized = protocolName.toLowerCase().replace(/\s+/g, '-');
  const normalizedWithSpaces = protocolName.toLowerCase();

  // Check alias first
  if (PROTOCOL_ALIASES[normalizedWithSpaces]) {
    const aliasKey = PROTOCOL_ALIASES[normalizedWithSpaces];
    if (YIIELD_PROTOCOLS[aliasKey]) {
      return YIIELD_PROTOCOLS[aliasKey];
    }
  }

  // Direct match with dashes
  if (YIIELD_PROTOCOLS[normalized]) {
    return YIIELD_PROTOCOLS[normalized];
  }

  // Try without version numbers
  const withoutVersion = normalized.replace(/-v\d+$/, '');
  if (YIIELD_PROTOCOLS[withoutVersion]) {
    return YIIELD_PROTOCOLS[withoutVersion];
  }

  // Try exact name match in values
  const entry = Object.entries(YIIELD_PROTOCOLS).find(
    ([_, info]) => info.name.toLowerCase() === protocolName.toLowerCase()
  );

  return entry?.[1];
}
