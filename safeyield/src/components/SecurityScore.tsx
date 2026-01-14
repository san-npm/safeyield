'use client';

import { useMemo } from 'react';
import { SecurityRating } from '@/types';
import { getSecurityRating, getRatingColor, getRatingLabel } from '@/utils/security';

interface SecurityScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showDetails?: boolean;
  audits?: number;
  protocolAge?: number;
}

export function SecurityScore({
  score,
  size = 'md',
  showLabel = true,
  showDetails = false,
  audits,
  protocolAge,
}: SecurityScoreProps) {
  const rating = getSecurityRating(score);
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
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex items-center gap-3">
      {/* Ring SVG */}
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
          {Math.round(score)}
        </div>
      </div>

      {/* Label and details */}
      {(showLabel || showDetails) && (
        <div className="flex flex-col">
          {showLabel && (
            <span
              className="font-semibold text-sm"
              style={{ color }}
            >
              {label}
            </span>
          )}
          {showDetails && (
            <div className="text-xs text-white/50 space-y-0.5">
              {audits !== undefined && (
                <div>{audits} audit{audits > 1 ? 's' : ''}</div>
              )}
              {protocolAge !== undefined && (
                <div>
                  {protocolAge > 365
                    ? `${Math.floor(protocolAge / 365)} an${Math.floor(protocolAge / 365) > 1 ? 's' : ''}`
                    : `${protocolAge} jours`
                  }
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Badge compact pour les tableaux
export function SecurityBadge({ score }: { score: number }) {
  const rating = getSecurityRating(score);
  
  const badgeClass = {
    excellent: 'badge-excellent',
    good: 'badge-good',
    moderate: 'badge-moderate',
    risky: 'badge-risky',
    danger: 'badge-danger',
  }[rating];

  return (
    <span className={`badge ${badgeClass}`}>
      {Math.round(score)}
    </span>
  );
}
