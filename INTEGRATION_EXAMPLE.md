# Integration Examples - Yiield Score

## 🎯 Quick Integration Guide

This document shows how to integrate the new Yiield Score system into your existing components.

---

## Example 1: Update PoolsTable Component

### Before (using SecurityScore)

```tsx
import { SecurityBadge } from '@/components';

export function PoolsTable({ pools }: { pools: YieldPool[] }) {
  return (
    <table>
      <tbody>
        {pools.map(pool => (
          <tr key={pool.id}>
            <td>{pool.protocol}</td>
            <td><SecurityBadge score={pool.securityScore} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### After (using YiieldScore with tooltip)

```tsx
import { YiieldScoreBadge, YiieldScoreTooltip } from '@/components';

export function PoolsTable({ pools }: { pools: YieldPool[] }) {
  return (
    <table>
      <tbody>
        {pools.map(pool => (
          <tr key={pool.id}>
            <td>{pool.protocol}</td>
            <td>
              <YiieldScoreTooltip pool={pool}>
                <YiieldScoreBadge pool={pool} />
              </YiieldScoreTooltip>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

**Changes:**
- ✅ Shows Yiield Score (with bonuses) instead of base score
- ✅ Team verification badge (✓, ⬡, Ø) displayed next to score
- ✅ Hover tooltip shows complete breakdown
- ✅ Golden +X badge for protocols with bonuses

---

## Example 2: Update TopPools Component

### Before

```tsx
import { SecurityScore } from '@/components';

export function TopPoolCard({ pool }: { pool: YieldPool }) {
  return (
    <div className="pool-card">
      <h3>{pool.protocol}</h3>
      <div className="apy">{pool.apy.toFixed(2)}%</div>
      <SecurityScore
        score={pool.securityScore}
        size="lg"
        showLabel={true}
        showDetails={true}
        audits={pool.audits}
        protocolAge={pool.protocolAge}
      />
    </div>
  );
}
```

### After

```tsx
import { YiieldScore } from '@/components';

export function TopPoolCard({ pool }: { pool: YieldPool }) {
  return (
    <div className="pool-card">
      <h3>{pool.protocol}</h3>
      <div className="apy">{pool.apy.toFixed(2)}%</div>
      <YiieldScore
        pool={pool}
        size="lg"
        showLabel={true}
        showBreakdown={true}
      />
    </div>
  );
}
```

**Changes:**
- ✅ Single `pool` prop instead of multiple props
- ✅ Shows enhanced score with bonuses
- ✅ Team badge included
- ✅ Breakdown shows all bonus categories

---

## Example 3: Pool Detail Modal

```tsx
import { YiieldScore, YiieldScoreTooltip } from '@/components';
import { getPoolScoreBreakdown } from '@/utils/yiieldScore';
import { getProtocolInfo } from '@/data/yiieldProtocols';

export function PoolDetailModal({ pool }: { pool: YieldPool }) {
  const protocolInfo = getProtocolInfo(pool.protocol);
  const scoreBreakdown = getPoolScoreBreakdown(pool);

  return (
    <div className="modal">
      <h2>{pool.protocol}</h2>

      {/* Visual Score Display */}
      <div className="score-section">
        <YiieldScore
          pool={pool}
          size="lg"
          showLabel={true}
          showBreakdown={true}
        />
      </div>

      {/* Detailed Information */}
      {protocolInfo && (
        <div className="details">
          <h3>Due Diligence</h3>

          {/* Auditors */}
          <div className="auditors">
            <h4>Security Audits ({protocolInfo.auditors.length})</h4>
            <ul>
              {protocolInfo.auditors.map((audit, i) => (
                <li key={i}>
                  <strong>{audit.name}</strong>
                  <span className="tier">Tier {audit.tier}</span>
                  {audit.reportUrl && (
                    <a href={audit.reportUrl} target="_blank">View Report</a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Team */}
          <div className="team">
            <h4>Team Status</h4>
            <p>
              {getTeamBadgeEmoji(protocolInfo.teamStatus)}{' '}
              {getTeamBadgeLabel(protocolInfo.teamStatus)}
            </p>
            {protocolInfo.teamDescription && (
              <p className="description">{protocolInfo.teamDescription}</p>
            )}
          </div>

          {/* Insurance */}
          {protocolInfo.insurance && (
            <div className="insurance">
              <h4>Insurance Coverage</h4>
              <p>
                <strong>{protocolInfo.insurance.provider}</strong>
                <br />
                Coverage: ${(protocolInfo.insurance.coverage / 1_000_000).toFixed(1)}M
              </p>
              {protocolInfo.insurance.url && (
                <a href={protocolInfo.insurance.url} target="_blank">
                  Get Coverage
                </a>
              )}
            </div>
          )}

          {/* Governance */}
          {protocolInfo.governance?.hasGovernance && (
            <div className="governance">
              <h4>Governance</h4>
              <p>
                Type: {protocolInfo.governance.governanceType?.toUpperCase()}
                <br />
                {protocolInfo.governance.description}
              </p>
            </div>
          )}

          {/* Score Breakdown */}
          <div className="score-breakdown">
            <h4>Score Calculation</h4>
            <table>
              <tbody>
                <tr>
                  <td>Base Security Score</td>
                  <td>{scoreBreakdown.baseScore}</td>
                </tr>
                {scoreBreakdown.auditorTierBonus > 0 && (
                  <tr>
                    <td>Audit Quality Bonus</td>
                    <td className="bonus">+{scoreBreakdown.auditorTierBonus}</td>
                  </tr>
                )}
                {scoreBreakdown.teamVerificationBonus > 0 && (
                  <tr>
                    <td>Team Verification Bonus</td>
                    <td className="bonus">+{scoreBreakdown.teamVerificationBonus}</td>
                  </tr>
                )}
                {scoreBreakdown.insuranceBonus > 0 && (
                  <tr>
                    <td>Insurance Bonus</td>
                    <td className="bonus">+{scoreBreakdown.insuranceBonus}</td>
                  </tr>
                )}
                {scoreBreakdown.governanceBonus > 0 && (
                  <tr>
                    <td>Governance Bonus</td>
                    <td className="bonus">+{scoreBreakdown.governanceBonus}</td>
                  </tr>
                )}
                <tr className="total">
                  <td><strong>Yiield Score</strong></td>
                  <td><strong>{Math.round(scoreBreakdown.total)}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## Example 4: Filter by Yiield Score

```tsx
import { useState } from 'react';
import { YieldPool } from '@/types';

export function AdvancedFilters() {
  const [useYiieldScore, setUseYiieldScore] = useState(true);
  const [minScore, setMinScore] = useState(70);

  const filterPools = (pools: YieldPool[]) => {
    return pools.filter(pool => {
      const score = useYiieldScore
        ? (pool.yiieldScore || pool.securityScore)
        : pool.securityScore;

      return score >= minScore;
    });
  };

  return (
    <div className="filters">
      <label>
        <input
          type="checkbox"
          checked={useYiieldScore}
          onChange={(e) => setUseYiieldScore(e.target.checked)}
        />
        Use Enhanced Yiield Score (includes bonuses)
      </label>

      <label>
        Minimum Score: {minScore}
        <input
          type="range"
          min="0"
          max="100"
          value={minScore}
          onChange={(e) => setMinScore(Number(e.target.value))}
        />
      </label>
    </div>
  );
}
```

---

## Example 5: Sorting by Yiield Score

```tsx
import { YieldPool } from '@/types';

export function getTopPoolsByYiieldScore(
  pools: YieldPool[],
  count: number = 10
): YieldPool[] {
  return [...pools]
    .sort((a, b) => {
      const scoreA = a.yiieldScore || a.securityScore;
      const scoreB = b.yiieldScore || b.securityScore;
      return scoreB - scoreA;
    })
    .slice(0, count);
}

// Combined score (APY + Security)
export function getTopPoolsBalanced(
  pools: YieldPool[],
  count: number = 10
): YieldPool[] {
  return [...pools]
    .sort((a, b) => {
      // Use Yiield Score if available, fallback to base score
      const scoreA = a.yiieldScore || a.securityScore;
      const scoreB = b.yiieldScore || b.securityScore;

      // APY (40%) + Security (60%)
      const combinedA = a.apy * 0.4 + scoreA * 0.6;
      const combinedB = b.apy * 0.4 + scoreB * 0.6;

      return combinedB - combinedA;
    })
    .slice(0, count);
}
```

---

## Example 6: Stats Dashboard

```tsx
import { YieldPool } from '@/types';
import { hasYiieldScoreData } from '@/utils/yiieldScore';

export function SecurityStats({ pools }: { pools: YieldPool[] }) {
  const stats = {
    totalPools: pools.length,
    withYiieldScore: pools.filter(p => p.yiieldScore).length,
    averageBaseScore: pools.reduce((sum, p) => sum + p.securityScore, 0) / pools.length,
    averageYiieldScore: pools.reduce((sum, p) => sum + (p.yiieldScore || p.securityScore), 0) / pools.length,
    verifiedTeams: pools.filter(p => hasYiieldScoreData(p.protocol)).length,
    withInsurance: pools.filter(p => {
      const info = getProtocolInfo(p.protocol);
      return info?.insurance !== undefined;
    }).length,
  };

  return (
    <div className="stats-grid">
      <div className="stat">
        <div className="value">{stats.totalPools}</div>
        <div className="label">Total Pools</div>
      </div>

      <div className="stat">
        <div className="value">{stats.withYiieldScore}</div>
        <div className="label">Enhanced Scores</div>
      </div>

      <div className="stat">
        <div className="value">{stats.averageBaseScore.toFixed(1)}</div>
        <div className="label">Avg Base Score</div>
      </div>

      <div className="stat highlight">
        <div className="value">{stats.averageYiieldScore.toFixed(1)}</div>
        <div className="label">Avg Yiield Score</div>
      </div>

      <div className="stat">
        <div className="value">{stats.verifiedTeams}</div>
        <div className="label">Verified Teams</div>
      </div>

      <div className="stat">
        <div className="value">{stats.withInsurance}</div>
        <div className="label">Insured Protocols</div>
      </div>
    </div>
  );
}
```

---

## Example 7: API Integration

When fetching real data from DefiLlama API:

```tsx
import { enrichPoolsWithYiieldScore } from '@/utils/yiieldScore';

export async function fetchPools(): Promise<YieldPool[]> {
  // Fetch from DefiLlama API
  const response = await fetch('https://yields.llama.fi/pools');
  const data = await response.json();

  // Transform DefiLlama data to your YieldPool format
  const pools: YieldPool[] = data.data.map(transformDefiLlamaPool);

  // Enrich with Yiield Scores
  const enrichedPools = enrichPoolsWithYiieldScore(pools);

  return enrichedPools;
}
```

---

## Common Patterns

### Pattern 1: Fallback to Base Score
```tsx
const displayScore = pool.yiieldScore || pool.securityScore;
```

### Pattern 2: Check if Enhanced Data Available
```tsx
import { hasYiieldScoreData } from '@/utils/yiieldScore';

if (hasYiieldScoreData(pool.protocol)) {
  // Show enhanced UI
} else {
  // Show basic UI
}
```

### Pattern 3: Progressive Enhancement
```tsx
// Show base score immediately
<SecurityBadge score={pool.securityScore} />

// Then upgrade to Yiield Score once data loaded
{pool.yiieldScore && (
  <YiieldScoreBadge pool={pool} />
)}
```

---

## Migration Checklist

- [ ] Replace `SecurityScore` imports with `YiieldScore`
- [ ] Update table components to use `YiieldScoreBadge`
- [ ] Add `YiieldScoreTooltip` wrapper for interactive elements
- [ ] Update sorting functions to use Yiield Score
- [ ] Update filters to use Yiield Score
- [ ] Test fallback behavior for protocols without enhanced data
- [ ] Update documentation/help text to mention Yiield Score
- [ ] Add "What's new" notification about enhanced scoring

---

## Performance Notes

- ✅ All calculations are client-side (no API calls)
- ✅ Scores are computed once when pools are enriched
- ✅ Components use React.memo for optimal re-rendering
- ✅ Tooltip only renders on hover
- ✅ Data is tree-shakeable (unused protocols won't bloat bundle)

---

## Testing

```tsx
import { enrichPoolWithYiieldScore, getPoolScoreBreakdown } from '@/utils/yiieldScore';

describe('Yiield Score', () => {
  it('should enrich pool with Yiield Score', () => {
    const pool = createMockPool('Aave V3', 95);
    const enriched = enrichPoolWithYiieldScore(pool);

    expect(enriched.yiieldScore).toBeGreaterThan(95);
  });

  it('should calculate correct bonuses', () => {
    const pool = createMockPool('Aave V3', 95);
    const breakdown = getPoolScoreBreakdown(pool);

    expect(breakdown.auditorTierBonus).toBe(10); // Tier 1 auditors
    expect(breakdown.teamVerificationBonus).toBe(5); // Doxxed
    expect(breakdown.insuranceBonus).toBe(3); // Nexus Mutual
    expect(breakdown.governanceBonus).toBe(2); // DAO
  });

  it('should fallback to base score for unknown protocols', () => {
    const pool = createMockPool('Unknown Protocol', 75);
    const enriched = enrichPoolWithYiieldScore(pool);

    expect(enriched.yiieldScore).toBe(75);
  });
});
```

---

**Need help?** Check [YIIELD_SCORE_IMPLEMENTATION.md](./YIIELD_SCORE_IMPLEMENTATION.md) for more details!
