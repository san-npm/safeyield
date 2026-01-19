'use client';

import { useMemo } from 'react';
import { SecurityRating, YieldPool } from '@/types';
import { getSecurityRating, getRatingColor, getRatingLabel } from '@/utils/security';
import { getPoolScoreBreakdown } from '@/utils/yiieldScore';
import { getProtocolInfo } from '@/data/yiieldProtocols';
import { getTeamBadgeEmoji, getTeamBadgeLabel } from '@/types/yiieldScore';

interface YiieldScoreProps {
  pool: YieldPool;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showBreakdown?: boolean;
}

export function YiieldScore({
  pool,
  size = 'md',
  showLabel = true,
  showBreakdown = false,
}: YiieldScoreProps) {
  const protocolInfo = getProtocolInfo(pool.protocol);
  const scoreBreakdown = getPoolScoreBreakdown(pool);
  const yiieldScore = pool.yiieldScore || pool.securityScore;

  const rating = getSecurityRating(yiieldScore);
  const color = getRatingColor(rating);
  const label = getRatingLabel(rating);

  const dimensions = useMemo(() => {
    switch (size) {
      case 'sm': return { size: 48, stroke: 4, fontSize: 'text-sm', badgeSize: 'text-xs' };
      case 'lg': return { size: 96, stroke: 6, fontSize: 'text-2xl', badgeSize: 'text-sm' };
      default: return { size: 64, stroke: 5, fontSize: 'text-lg', badgeSize: 'text-xs' };
    }
  }, [size]);

  const radius = (dimensions.size - dimensions.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (yiieldScore / 100) * circumference;

  const hasBonus = scoreBreakdown.rawTotal > scoreBreakdown.baseScore;
  const totalBonus = scoreBreakdown.rawTotal - scoreBreakdown.baseScore;

  return (
    <div className="flex items-center gap-3">
      {/* Score Ring */}
      <div className="relative" style={{ width: dimensions.size, height: dimensions.size }}>
        <svg
          width={dimensions.size}
          height={dimensions.size}
          className="transform -rotate-90"
        >
          {/* Background ring */}
          <circle
            cx={dimensions.size / 2}
            cy={dimensions.size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={dimensions.stroke}
          />
          {/* Progress ring */}
          <circle
            cx={dimensions.size / 2}
            cy={dimensions.size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={dimensions.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 6px ${color}40)`,
            }}
          />
        </svg>
        {/* Score number */}
        <div
          className={`absolute inset-0 flex items-center justify-center font-bold ${dimensions.fontSize}`}
          style={{ color }}
        >
          {Math.round(yiieldScore)}
        </div>
        {/* Bonus badge if applicable */}
        {hasBonus && (
          <div
            className={`absolute -top-1 -right-1 ${dimensions.badgeSize} font-bold px-1.5 py-0.5 rounded-full`}
            style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              color: '#000',
              boxShadow: '0 2px 8px rgba(255, 215, 0, 0.4)',
            }}
          >
            +{totalBonus}
          </div>
        )}
      </div>

      {/* Labels and team badge */}
      {(showLabel || protocolInfo) && (
        <div className="flex flex-col gap-1">
          {showLabel && (
            <span
              className="font-semibold text-sm"
              style={{ color }}
            >
              {label}
            </span>
          )}
          {protocolInfo && (
            <div className="flex items-center gap-1.5">
              <span className="text-lg">
                {getTeamBadgeEmoji(protocolInfo.teamStatus)}
              </span>
              <span className="text-xs text-white/60">
                {getTeamBadgeLabel(protocolInfo.teamStatus)}
              </span>
            </div>
          )}
          {showBreakdown && hasBonus && (
            <div className="text-xs text-white/50 space-y-0.5 mt-1">
              <div>Base: {scoreBreakdown.baseScore}</div>
              {scoreBreakdown.auditorTierBonus > 0 && (
                <div>Audits: +{scoreBreakdown.auditorTierBonus}</div>
              )}
              {scoreBreakdown.teamVerificationBonus > 0 && (
                <div>Team: +{scoreBreakdown.teamVerificationBonus}</div>
              )}
              {scoreBreakdown.insuranceBonus > 0 && (
                <div>Insurance: +{scoreBreakdown.insuranceBonus}</div>
              )}
              {scoreBreakdown.governanceBonus > 0 && (
                <div>Governance: +{scoreBreakdown.governanceBonus}</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Compact badge for tables
export function YiieldScoreBadge({ pool }: { pool: YieldPool }) {
  const yiieldScore = pool.yiieldScore || pool.securityScore;
  const rating = getSecurityRating(yiieldScore);
  const protocolInfo = getProtocolInfo(pool.protocol);

  const badgeClass = {
    excellent: 'badge-excellent',
    good: 'badge-good',
    moderate: 'badge-moderate',
    risky: 'badge-risky',
    danger: 'badge-danger',
  }[rating];

  const scoreBreakdown = getPoolScoreBreakdown(pool);
  const hasBonus = scoreBreakdown.rawTotal > scoreBreakdown.baseScore;

  return (
    <div className="flex items-center gap-2">
      <span className={`badge ${badgeClass} relative`}>
        {Math.round(yiieldScore)}
        {hasBonus && (
          <span
            className="absolute -top-1 -right-1 text-xs font-bold px-1 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              color: '#000',
              fontSize: '0.6rem',
            }}
          >
            +
          </span>
        )}
      </span>
      {protocolInfo && (
        <span className="text-sm" title={getTeamBadgeLabel(protocolInfo.teamStatus)}>
          {getTeamBadgeEmoji(protocolInfo.teamStatus)}
        </span>
      )}
    </div>
  );
}
