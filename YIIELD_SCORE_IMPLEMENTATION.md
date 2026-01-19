# Yiield Score Implementation Guide

## 📊 Overview

The Yiield Score is an enhanced security scoring system that extends the base DefiLlama security score with additional due diligence criteria. It provides a more comprehensive assessment of protocol safety.

## 🔢 Score Calculation

### Base Score (0-100 points)
The DefiLlama security score based on:
- **Audits** (0-25 pts): Number of security audits
- **Age** (0-25 pts): Protocol age (older = more battle-tested)
- **TVL** (0-25 pts): Total Value Locked (higher = more market confidence)
- **Exploits** (0-25 pts): Absence of past exploits

### Bonus Points (up to +20 points)

| Criterion | Points | Description |
|-----------|--------|-------------|
| **Tier 1 Auditors** | +10 | Trail of Bits, OpenZeppelin, Consensys Diligence, Sigma Prime, ChainSecurity, Spearbit |
| **Tier 2 Auditors** | +6 | Certik, PeckShield, Halborn, Quantstamp, Cyfrin, OtterSec, etc. |
| **Tier 3 Auditors** | +3 | Hacken, Sherlock, Code4rena, Beosin, etc. |
| **Doxxed Team** | +5 | Publicly identified team members |
| **Verified by Yiield** | +3 | Team personally known to Yiield |
| **Insurance Coverage** | +3 | Available via Nexus Mutual, InsurAce, OpenCover, Neptune Mutual, or ease |
| **Governance** | +2 | Decentralized governance (DAO, multisig, timelock) |

### Final Score
- **Raw score**: Base + Bonuses (0-120)
- **Normalized score**: (Raw / 120) × 100 = Final Yiield Score (0-100)

## 📁 File Structure

```
src/
├── types/
│   ├── index.ts              # Extended YieldPool with yiieldScore field
│   └── yiieldScore.ts        # Yiield Score types and calculation functions
├── data/
│   ├── mockPools.ts          # Mock pools enriched with Yiield Scores
│   └── yiieldProtocols.ts    # Protocol database with due diligence data
├── utils/
│   ├── yiieldScore.ts        # Utility functions to enrich pools
│   └── i18n.tsx              # Translations updated with new keys
└── components/
    ├── YiieldScore.tsx       # Main score display component
    ├── YiieldScoreTooltip.tsx # Detailed breakdown tooltip
    └── index.ts              # Component exports
```

## 🎨 Components

### YiieldScore
Main component for displaying the Yiield Score with visual ring and team badge.

```tsx
import { YiieldScore } from '@/components';

<YiieldScore
  pool={pool}
  size="md"              // 'sm' | 'md' | 'lg'
  showLabel={true}       // Show security rating label
  showBreakdown={false}  // Show detailed breakdown
/>
```

### YiieldScoreBadge
Compact badge for tables.

```tsx
import { YiieldScoreBadge } from '@/components';

<YiieldScoreBadge pool={pool} />
```

### YiieldScoreTooltip
Hover tooltip showing complete score breakdown.

```tsx
import { YiieldScoreTooltip } from '@/components';

<YiieldScoreTooltip pool={pool}>
  <YiieldScoreBadge pool={pool} />
</YiieldScoreTooltip>
```

## 🔧 Usage Examples

### Display Yiield Score instead of base security score

```tsx
// Before (SecurityScore)
import { SecurityScore } from '@/components';
<SecurityScore score={pool.securityScore} />

// After (YiieldScore)
import { YiieldScore } from '@/components';
<YiieldScore pool={pool} />
```

### Add tooltip to existing badge

```tsx
import { YiieldScoreTooltip, YiieldScoreBadge } from '@/components';

<YiieldScoreTooltip pool={pool}>
  <YiieldScoreBadge pool={pool} />
</YiieldScoreTooltip>
```

### Get score breakdown programmatically

```tsx
import { getPoolScoreBreakdown } from '@/utils/yiieldScore';

const breakdown = getPoolScoreBreakdown(pool);
console.log({
  base: breakdown.baseScore,
  auditorBonus: breakdown.auditorTierBonus,
  teamBonus: breakdown.teamVerificationBonus,
  insuranceBonus: breakdown.insuranceBonus,
  governanceBonus: breakdown.governanceBonus,
  total: breakdown.total,
  raw: breakdown.rawTotal
});
```

## 📝 Adding New Protocols

To add Yiield Score data for a new protocol, edit `src/data/yiieldProtocols.ts`:

```typescript
export const YIIELD_PROTOCOLS: Record<string, YiieldProtocolInfo> = {
  'your-protocol': {
    name: 'Your Protocol',
    slug: 'your-protocol',
    teamStatus: 'doxxed', // 'doxxed' | 'verified' | 'anonymous'
    teamDescription: 'Founded by John Doe',
    auditors: [
      { name: 'Trail of Bits', tier: 1, reportUrl: 'https://...' },
      { name: 'Certik', tier: 2 },
    ],
    insurance: {
      provider: 'Nexus Mutual',
      coverage: 10_000_000,
      url: 'https://...'
    },
    governance: {
      hasGovernance: true,
      governanceType: 'dao',
      description: 'TOKEN holders govern'
    },
    notes: 'Optional special notes'
  },
};
```

## 🎯 Team Verification Badges

| Status | Badge | Description | Points |
|--------|-------|-------------|--------|
| **doxxed** | ✓ Public | Publicly identified team | +5 |
| **verified** | ⬡ Verified | Verified by Yiield personally | +3 |
| **anonymous** | Ø Anon | Anonymous team | 0 |

## 🔐 Insurance Providers

Supported insurance protocols:
- **Nexus Mutual** (Ethereum mainnet)
- **InsurAce** (Multi-chain)
- **OpenCover** (Base, Polygon, Optimism)
- **Neptune Mutual** (Ethereum, Arbitrum)
- **ease** (Ethereum)

## 🌍 Translations

All Yiield Score labels are translated in 5 languages (EN/FR/IT/ES/DE).

New translation keys:
- `yiield.scoreBreakdown`
- `yiield.baseScore`
- `yiield.baseScoreDesc`
- `yiield.bonuses`
- `yiield.auditQuality`
- `yiield.teamVerification`
- `yiield.insuranceCoverage`
- `yiield.governance`
- `yiield.total`
- `yiield.team.doxxed`
- `yiield.team.verified`
- `yiield.team.anonymous`

## 📊 Current Protocol Coverage

Protocols with full Yiield Score data:

### Tier 1 (95+ base score)
- Aave V3, Aave V2
- Compound V3
- Morpho, Morpho Blue

### Established Protocols
- Spark (MakerDAO ecosystem)
- Fluid (Instadapp)
- Euler V2
- Silo V2
- Venus
- Benqi

### Solana Ecosystem
- Kamino
- Jupiter Lend
- Drift
- Solend
- MarginFi

### Credit Markets
- Maple
- **Lagoon** ⬡ (Verified by Yiield)
- **Wildcat** ⬡ (Verified by Yiield)

### Vault Managers
- Steakhouse
- Veda
- Concrete
- Mellow
- **Cap Money** ⬡ (Verified by Yiield)

### Other
- Radiant V2
- Ajna
- Dolomite

## 🚀 Next Steps

1. **Integrate into UI**: Replace existing SecurityScore components with YiieldScore
2. **API Integration**: When connecting to real DefiLlama API, use `enrichPoolWithYiieldScore()` to add Yiield Score
3. **Keep data updated**: Regularly update `src/data/yiieldProtocols.ts` with new audits, insurance, team changes
4. **Add more protocols**: Expand coverage to all protocols shown in the app

## 💡 Tips

- The Yiield Score automatically falls back to base security score if no protocol data is available
- Use `hasYiieldScoreData(protocolName)` to check if enhanced data exists
- The tooltip only shows for protocols with enhanced data
- All calculations are client-side, no API calls needed
- Scores are cached in the enriched pool objects for performance

## 📞 Support

For questions about implementation:
- Check `src/types/yiieldScore.ts` for all calculation functions
- See `src/data/yiieldProtocols.ts` for data structure examples
- Review `src/components/YiieldScore.tsx` for component usage

---

**Built with ❤️ for the Yiield community**
