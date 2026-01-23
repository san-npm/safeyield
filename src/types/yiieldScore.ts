// Enhanced Yiield Score system
// Extends the base DefiLlama security score with additional due diligence criteria

export type AuditorTier = 1 | 2 | 3;

export type TeamVerificationStatus =
  | 'doxxed'      // Publicly identified team
  | 'verified'    // Verified by Yiield (personal relationship)
  | 'anonymous';  // Anonymous team

export interface AuditorInfo {
  name: string;
  tier: AuditorTier;
  reportUrl?: string;
  date?: Date;
}

export interface InsuranceInfo {
  provider: 'Nexus Mutual' | 'InsurAce' | 'OpenCover' | 'Neptune Mutual' | 'ease';
  coverage: number; // Coverage amount in USD
  url?: string;
}

export interface GovernanceInfo {
  hasGovernance: boolean;
  governanceType?: 'dao' | 'multisig' | 'timelock';
  description?: string;
}

// Extended protocol information for Yiield Score
export interface YiieldProtocolInfo {
  name: string;
  slug: string;

  // Team verification
  teamStatus: TeamVerificationStatus;
  teamDescription?: string;

  // Audits with quality classification
  auditors: AuditorInfo[];

  // Insurance coverage
  insurance?: InsuranceInfo;

  // Governance
  governance?: GovernanceInfo;

  // Additional notes (e.g., "Verified by Yiield team personally")
  notes?: string;
}

// Score breakdown for transparency
export interface YiieldScoreBreakdown {
  // Base score (from DefiLlama)
  baseScore: number;                    // 0-100

  // Bonus points
  auditorTierBonus: number;             // 0-10 (Tier 1 auditors)
  teamVerificationBonus: number;        // 0-5 (Doxxed team)
  insuranceBonus: number;               // 0-3 (Insurance available)
  governanceBonus: number;              // 0-2 (Decentralized governance)

  // Total (normalized to 100)
  total: number;                        // 0-100
  rawTotal: number;                     // 0-120 (before normalization)
}

// Auditor tier classification
export const AUDITOR_TIERS: Record<string, AuditorTier> = {
  // Tier 1 (Elite) - +10 pts
  'Trail of Bits': 1,
  'OpenZeppelin': 1,
  'Consensys Diligence': 1,
  'Sigma Prime': 1,
  'ChainSecurity': 1,
  'Spearbit': 1,

  // Tier 2 (Established) - +6 pts
  'Certik': 2,
  'PeckShield': 2,
  'Halborn': 2,
  'Quantstamp': 2,
  'Cyfrin': 2,
  'OtterSec': 2,
  'Zellic': 2,
  'BlockSec': 2,
  'Nethermind Security': 2,
  'Slowmist': 2,
  'MixBytes': 2,
  'Cantina': 2,
  'Certora': 2,
  'ABDK': 2,

  // Tier 3 (Recognized) - +3 pts
  'Hacken': 3,
  'Sherlock': 3,
  'Code4rena': 3,
  'Beosin': 3,
  'Ackee Blockchain': 3,
  'Hexens': 3,
  'Statemind': 3,
  'OXORIO': 3,
  'Omniscia': 3,
  'Offside Labs': 3,
};

// Get tier for an auditor name
export function getAuditorTier(auditorName: string): AuditorTier | null {
  return AUDITOR_TIERS[auditorName] || null;
}

// Calculate auditor tier bonus
export function calculateAuditorBonus(auditors: AuditorInfo[]): number {
  if (auditors.length === 0) return 0;

  const hasTier1 = auditors.some(a => a.tier === 1);
  const hasTier2 = auditors.some(a => a.tier === 2);
  const hasTier3 = auditors.some(a => a.tier === 3);

  if (hasTier1) return 10;
  if (hasTier2) return 6;
  if (hasTier3) return 3;

  return 0;
}

// Calculate team verification bonus
export function calculateTeamBonus(status: TeamVerificationStatus): number {
  switch (status) {
    case 'doxxed':
      return 5;
    case 'verified':
      return 3;
    case 'anonymous':
      return 0;
  }
}

// Calculate insurance bonus
export function calculateInsuranceBonus(insurance?: InsuranceInfo): number {
  return insurance ? 3 : 0;
}

// Calculate governance bonus
export function calculateGovernanceBonus(governance?: GovernanceInfo): number {
  return governance?.hasGovernance ? 2 : 0;
}

// Calculate complete Yiield Score
export function calculateYiieldScore(
  baseScore: number,
  protocolInfo?: YiieldProtocolInfo
): YiieldScoreBreakdown {
  if (!protocolInfo) {
    return {
      baseScore,
      auditorTierBonus: 0,
      teamVerificationBonus: 0,
      insuranceBonus: 0,
      governanceBonus: 0,
      total: baseScore,
      rawTotal: baseScore,
    };
  }

  const auditorBonus = calculateAuditorBonus(protocolInfo.auditors);
  const teamBonus = calculateTeamBonus(protocolInfo.teamStatus);
  const insuranceBonus = calculateInsuranceBonus(protocolInfo.insurance);
  const governanceBonus = calculateGovernanceBonus(protocolInfo.governance);

  const rawTotal = baseScore + auditorBonus + teamBonus + insuranceBonus + governanceBonus;

  // Normalize to 100 (max raw score is 120)
  const normalizedTotal = Math.min(100, (rawTotal / 120) * 100);

  return {
    baseScore,
    auditorTierBonus: auditorBonus,
    teamVerificationBonus: teamBonus,
    insuranceBonus,
    governanceBonus,
    total: normalizedTotal,
    rawTotal,
  };
}

// Get team verification badge emoji
export function getTeamBadgeEmoji(status: TeamVerificationStatus): string {
  switch (status) {
    case 'doxxed':
      return '👤';
    case 'verified':
      return '✓';
    case 'anonymous':
      return '👻';
  }
}

// Get team verification label
export function getTeamBadgeLabel(status: TeamVerificationStatus): string {
  switch (status) {
    case 'doxxed':
      return 'Public';
    case 'verified':
      return 'Verified';
    case 'anonymous':
      return 'Anon';
  }
}
