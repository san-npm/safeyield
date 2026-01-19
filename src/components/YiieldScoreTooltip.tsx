'use client';

import { useState } from 'react';
import { YieldPool } from '@/types';
import { getPoolScoreBreakdown } from '@/utils/yiieldScore';
import { getProtocolInfo } from '@/data/yiieldProtocols';
import { getTeamBadgeLabel } from '@/types/yiieldScore';

interface YiieldScoreTooltipProps {
  pool: YieldPool;
  children: React.ReactNode;
}

export function YiieldScoreTooltip({ pool, children }: YiieldScoreTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const protocolInfo = getProtocolInfo(pool.protocol);
  const scoreBreakdown = getPoolScoreBreakdown(pool);

  if (!protocolInfo) {
    return <>{children}</>;
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {children}

      {isOpen && (
        <div
          className="absolute z-50 w-80 p-4 rounded-lg shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(30, 30, 46, 0.98) 0%, rgba(20, 20, 32, 0.98) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginTop: '8px',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/10">
            <h3 className="font-bold text-white">Yiield Score Breakdown</h3>
            <span className="text-2xl font-bold text-purple-400">
              {Math.round(scoreBreakdown.total)}
            </span>
          </div>

          {/* Base Score */}
          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/70">Base Security Score</span>
              <span className="font-semibold text-white">{scoreBreakdown.baseScore}</span>
            </div>
            <div className="text-xs text-white/50 pl-2">
              ↳ Based on audits, age, TVL, exploits
            </div>
          </div>

          {/* Bonuses */}
          {scoreBreakdown.rawTotal > scoreBreakdown.baseScore && (
            <div className="space-y-2 mb-3 pb-3 border-b border-white/10">
              <div className="text-xs font-semibold text-purple-300 mb-2">BONUSES</div>

              {scoreBreakdown.auditorTierBonus > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Audit Quality</span>
                    <span className="font-semibold text-green-400">
                      +{scoreBreakdown.auditorTierBonus}
                    </span>
                  </div>
                  <div className="text-xs text-white/50 pl-2">
                    {protocolInfo.auditors.map(a => a.name).join(', ')}
                  </div>
                </div>
              )}

              {scoreBreakdown.teamVerificationBonus > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Team Verification</span>
                    <span className="font-semibold text-green-400">
                      +{scoreBreakdown.teamVerificationBonus}
                    </span>
                  </div>
                  <div className="text-xs text-white/50 pl-2">
                    {getTeamBadgeLabel(protocolInfo.teamStatus)}
                    {protocolInfo.teamDescription && ` - ${protocolInfo.teamDescription}`}
                  </div>
                </div>
              )}

              {scoreBreakdown.insuranceBonus > 0 && protocolInfo.insurance && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Insurance Coverage</span>
                    <span className="font-semibold text-green-400">
                      +{scoreBreakdown.insuranceBonus}
                    </span>
                  </div>
                  <div className="text-xs text-white/50 pl-2">
                    {protocolInfo.insurance.provider} - $
                    {(protocolInfo.insurance.coverage / 1_000_000).toFixed(1)}M
                  </div>
                </div>
              )}

              {scoreBreakdown.governanceBonus > 0 && protocolInfo.governance && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Governance</span>
                    <span className="font-semibold text-green-400">
                      +{scoreBreakdown.governanceBonus}
                    </span>
                  </div>
                  <div className="text-xs text-white/50 pl-2">
                    {protocolInfo.governance.governanceType?.toUpperCase() || 'Decentralized'}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Total */}
          <div className="flex items-center justify-between text-sm font-bold pt-2">
            <span className="text-white">Total Yiield Score</span>
            <div className="flex items-center gap-2">
              <span className="text-white/50 line-through text-xs">
                {scoreBreakdown.rawTotal}
              </span>
              <span
                className="text-lg px-2 py-1 rounded"
                style={{
                  background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                }}
              >
                {Math.round(scoreBreakdown.total)}
              </span>
            </div>
          </div>

          {protocolInfo.notes && (
            <div className="mt-3 pt-3 border-t border-white/10 text-xs text-purple-300">
              {protocolInfo.notes}
            </div>
          )}

          {/* Arrow */}
          <div
            className="absolute w-3 h-3 rotate-45"
            style={{
              background: 'rgba(30, 30, 46, 0.98)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRight: 'none',
              borderBottom: 'none',
              top: '-6px',
              left: '50%',
              transform: 'translateX(-50%) rotate(45deg)',
            }}
          />
        </div>
      )}
    </div>
  );
}
