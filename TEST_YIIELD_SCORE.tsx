// TEST FILE - Quick demonstration of Yiield Score system
// Copy this to a test page or component to see the system in action

import { MOCK_POOLS } from '@/data/mockPools';
import { YiieldScore, YiieldScoreBadge, YiieldScoreTooltip } from '@/components';
import { getPoolScoreBreakdown } from '@/utils/yiieldScore';
import { getProtocolInfo } from '@/data/yiieldProtocols';

export default function TestYiieldScore() {
  // Get some interesting examples
  const aavePool = MOCK_POOLS.find(p => p.protocol === 'Aave V3');
  const morphoPool = MOCK_POOLS.find(p => p.protocol === 'Morpho Blue');
  const lagoonPool = MOCK_POOLS.find(p => p.id === 'lagoon-usdc-eth'); // Verified by Yiield
  const unknownPool = MOCK_POOLS[0]; // Protocol without enhanced data

  return (
    <div style={{ padding: '40px', background: '#1a1a2e', minHeight: '100vh' }}>
      <h1 style={{ color: 'white', marginBottom: '40px' }}>
        Yiield Score Test Page
      </h1>

      {/* Test 1: Large display with breakdown */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ color: '#a855f7', marginBottom: '20px' }}>
          Test 1: Large Display with Breakdown
        </h2>
        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
          {aavePool && (
            <div style={cardStyle}>
              <h3 style={{ color: 'white', marginBottom: '10px' }}>
                {aavePool.protocol}
              </h3>
              <YiieldScore
                pool={aavePool}
                size="lg"
                showLabel={true}
                showBreakdown={true}
              />
              <ScoreDetails pool={aavePool} />
            </div>
          )}

          {morphoPool && (
            <div style={cardStyle}>
              <h3 style={{ color: 'white', marginBottom: '10px' }}>
                {morphoPool.protocol}
              </h3>
              <YiieldScore
                pool={morphoPool}
                size="lg"
                showLabel={true}
                showBreakdown={true}
              />
              <ScoreDetails pool={morphoPool} />
            </div>
          )}
        </div>
      </section>

      {/* Test 2: Badge with tooltip */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ color: '#a855f7', marginBottom: '20px' }}>
          Test 2: Compact Badge with Tooltip (hover me!)
        </h2>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {MOCK_POOLS.slice(0, 5).map(pool => (
            <div key={pool.id} style={{ textAlign: 'center' }}>
              <div style={{ color: 'white', fontSize: '12px', marginBottom: '8px' }}>
                {pool.protocol}
              </div>
              <YiieldScoreTooltip pool={pool}>
                <YiieldScoreBadge pool={pool} />
              </YiieldScoreTooltip>
            </div>
          ))}
        </div>
      </section>

      {/* Test 3: Verified by Yiield protocol */}
      {lagoonPool && (
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ color: '#a855f7', marginBottom: '20px' }}>
            Test 3: "Verified by Yiield" Protocol ⬡
          </h2>
          <div style={cardStyle}>
            <h3 style={{ color: 'white', marginBottom: '10px' }}>
              {lagoonPool.protocol}
            </h3>
            <YiieldScore
              pool={lagoonPool}
              size="lg"
              showLabel={true}
              showBreakdown={true}
            />
            <ScoreDetails pool={lagoonPool} />
            <div style={{
              marginTop: '20px',
              padding: '10px',
              background: 'rgba(168, 85, 247, 0.1)',
              borderRadius: '8px',
              color: '#a855f7'
            }}>
              ⬡ This protocol is personally verified by the Yiield team
            </div>
          </div>
        </section>
      )}

      {/* Test 4: Comparison table */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ color: '#a855f7', marginBottom: '20px' }}>
          Test 4: Score Comparison Table
        </h2>
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          padding: '20px',
          overflow: 'auto'
        }}>
          <table style={{ width: '100%', color: 'white', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ textAlign: 'left', padding: '12px' }}>Protocol</th>
                <th style={{ textAlign: 'center', padding: '12px' }}>Base Score</th>
                <th style={{ textAlign: 'center', padding: '12px' }}>Yiield Score</th>
                <th style={{ textAlign: 'center', padding: '12px' }}>Bonus</th>
                <th style={{ textAlign: 'center', padding: '12px' }}>Team</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_POOLS.slice(0, 10).map(pool => {
                const breakdown = getPoolScoreBreakdown(pool);
                const protocolInfo = getProtocolInfo(pool.protocol);
                return (
                  <tr key={pool.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '12px' }}>{pool.protocol}</td>
                    <td style={{ textAlign: 'center', padding: '12px' }}>
                      {pool.securityScore}
                    </td>
                    <td style={{ textAlign: 'center', padding: '12px' }}>
                      <YiieldScoreTooltip pool={pool}>
                        <span style={{ cursor: 'help' }}>
                          {Math.round(breakdown.total)}
                        </span>
                      </YiieldScoreTooltip>
                    </td>
                    <td style={{ textAlign: 'center', padding: '12px' }}>
                      {breakdown.rawTotal > breakdown.baseScore ? (
                        <span style={{
                          color: '#FFD700',
                          fontWeight: 'bold'
                        }}>
                          +{breakdown.rawTotal - breakdown.baseScore}
                        </span>
                      ) : (
                        <span style={{ color: 'rgba(255,255,255,0.3)' }}>-</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center', padding: '12px', fontSize: '18px' }}>
                      {protocolInfo ? (
                        <span title={protocolInfo.teamStatus}>
                          {protocolInfo.teamStatus === 'doxxed' ? '✓' :
                           protocolInfo.teamStatus === 'verified' ? '⬡' : 'Ø'}
                        </span>
                      ) : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Test 5: Score breakdown details */}
      <section>
        <h2 style={{ color: '#a855f7', marginBottom: '20px' }}>
          Test 5: Detailed Score Breakdown
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {MOCK_POOLS.slice(0, 6).map(pool => {
            const breakdown = getPoolScoreBreakdown(pool);
            const protocolInfo = getProtocolInfo(pool.protocol);

            return (
              <div key={pool.id} style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '12px',
                padding: '20px',
                color: 'white'
              }}>
                <h3 style={{ marginBottom: '15px', color: '#a855f7' }}>
                  {pool.protocol}
                </h3>

                <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.7)' }}>Base Score:</span>
                    <strong>{breakdown.baseScore}</strong>
                  </div>

                  {breakdown.auditorTierBonus > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: 'rgba(255,255,255,0.7)' }}>Audit Bonus:</span>
                      <strong style={{ color: '#10b981' }}>+{breakdown.auditorTierBonus}</strong>
                    </div>
                  )}

                  {breakdown.teamVerificationBonus > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: 'rgba(255,255,255,0.7)' }}>Team Bonus:</span>
                      <strong style={{ color: '#10b981' }}>+{breakdown.teamVerificationBonus}</strong>
                    </div>
                  )}

                  {breakdown.insuranceBonus > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: 'rgba(255,255,255,0.7)' }}>Insurance:</span>
                      <strong style={{ color: '#10b981' }}>+{breakdown.insuranceBonus}</strong>
                    </div>
                  )}

                  {breakdown.governanceBonus > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: 'rgba(255,255,255,0.7)' }}>Governance:</span>
                      <strong style={{ color: '#10b981' }}>+{breakdown.governanceBonus}</strong>
                    </div>
                  )}

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '12px',
                    paddingTop: '12px',
                    borderTop: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    <span style={{ fontWeight: 'bold' }}>Yiield Score:</span>
                    <strong style={{ fontSize: '18px', color: '#a855f7' }}>
                      {Math.round(breakdown.total)}
                    </strong>
                  </div>

                  {protocolInfo && (
                    <div style={{
                      marginTop: '12px',
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.5)'
                    }}>
                      {protocolInfo.auditors.length} audit(s) •{' '}
                      {protocolInfo.teamStatus === 'doxxed' ? '✓ Public' :
                       protocolInfo.teamStatus === 'verified' ? '⬡ Verified' : 'Ø Anon'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Legend */}
      <section style={{ marginTop: '60px', padding: '20px', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '12px' }}>
        <h3 style={{ color: '#a855f7', marginBottom: '15px' }}>Legend</h3>
        <div style={{ color: 'white', fontSize: '14px', lineHeight: '2' }}>
          <div>✓ = Doxxed team (+5 pts)</div>
          <div>⬡ = Verified by Yiield (+3 pts)</div>
          <div>Ø = Anonymous team (0 pts)</div>
          <div style={{ marginTop: '10px' }}>
            Audit bonuses: Tier 1 (+10), Tier 2 (+6), Tier 3 (+3)
          </div>
          <div>Insurance: +3 pts | Governance: +2 pts</div>
        </div>
      </section>
    </div>
  );
}

// Helper component to display score details
function ScoreDetails({ pool }: { pool: any }) {
  const breakdown = getPoolScoreBreakdown(pool);
  const protocolInfo = getProtocolInfo(pool.protocol);

  return (
    <div style={{
      marginTop: '20px',
      fontSize: '12px',
      color: 'rgba(255,255,255,0.7)',
      lineHeight: '1.8'
    }}>
      <div>Base: {breakdown.baseScore}</div>
      {breakdown.auditorTierBonus > 0 && (
        <div>Audits: +{breakdown.auditorTierBonus}</div>
      )}
      {breakdown.teamVerificationBonus > 0 && (
        <div>Team: +{breakdown.teamVerificationBonus}</div>
      )}
      {breakdown.insuranceBonus > 0 && (
        <div>Insurance: +{breakdown.insuranceBonus}</div>
      )}
      {breakdown.governanceBonus > 0 && (
        <div>Governance: +{breakdown.governanceBonus}</div>
      )}
      <div style={{ marginTop: '8px', fontWeight: 'bold', color: '#a855f7' }}>
        Total: {Math.round(breakdown.total)}
      </div>

      {protocolInfo && (
        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div>{protocolInfo.auditors.length} audit(s): {protocolInfo.auditors.map(a => a.name).join(', ')}</div>
          {protocolInfo.insurance && (
            <div>Insurance: {protocolInfo.insurance.provider} (${(protocolInfo.insurance.coverage / 1_000_000).toFixed(1)}M)</div>
          )}
        </div>
      )}
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  borderRadius: '12px',
  padding: '30px',
  minWidth: '300px',
  border: '1px solid rgba(255,255,255,0.1)'
};
