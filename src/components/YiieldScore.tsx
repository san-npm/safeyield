'use client';

import { useMemo } from 'react';
import { YieldPool } from '@/types';
import { getSecurityRating, getRatingColor, getRatingLabel } from '@/utils/security';
import { getPoolScoreBreakdown } from '@/utils/yiieldScore';

interface YiieldScoreProps {
  pool: YieldPool;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function YiieldScore({
  pool,
  size = 'md',
  showLabel = true,
}: YiieldScoreProps) {
  const scoreBreakdown = getPoolScoreBreakdown(pool);
  const yiieldScore = pool.yiieldScore || pool.securityScore;

  const rating = getSecurityRating(yiieldScore);
  const color = getRatingColor(rating);
  const label = getRatingLabel(rating);

  const dimensions = useMemo(() => {
    switch (size) {
      case 'sm': return { size: 48, stroke: 4, fontSize: 'text-sm' };
      case 'lg': return { size: 96, stroke: 6, fontSize: 'text-2xl' };
      default: return { size: 64, stroke: 5, fontSize: 'text-lg' };
    }
  }, [size]);

  const radius = (dimensions.size - dimensions.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (yiieldScore / 100) * circumference;

  const hasBonus = scoreBreakdown.rawTotal > scoreBreakdown.baseScore;

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
          {/* Progress ring - enhanced glow for protocols with bonuses */}
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
              filter: hasBonus
                ? `drop-shadow(0 0 8px ${color}60) drop-shadow(0 0 16px ${color}30)`
                : `drop-shadow(0 0 6px ${color}40)`,
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
      </div>

      {/* Label only */}
      {showLabel && (
        <span
          className="font-semibold text-sm"
          style={{ color }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

// Compact badge for tables - shows only final score with quality indicator
export function YiieldScoreBadge({ pool }: { pool: YieldPool }) {
  const yiieldScore = pool.yiieldScore || pool.securityScore;
  const rating = getSecurityRating(yiieldScore);
  const scoreBreakdown = getPoolScoreBreakdown(pool);
  const hasBonus = scoreBreakdown.rawTotal > scoreBreakdown.baseScore;

  const badgeClass = {
    excellent: 'badge-excellent',
    good: 'badge-good',
    moderate: 'badge-moderate',
    risky: 'badge-risky',
    danger: 'badge-danger',
  }[rating];

  // Enhanced glow for protocols with bonuses
  const glowStyle = hasBonus ? {
    boxShadow: `0 0 12px ${getRatingColor(rating)}50, 0 0 4px ${getRatingColor(rating)}30`,
  } : {};

  return (
    <span className={`badge ${badgeClass} cursor-help`} style={glowStyle}>
      {Math.round(yiieldScore)}
    </span>
  );
}
