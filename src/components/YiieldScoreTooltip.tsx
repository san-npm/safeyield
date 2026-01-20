'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { YieldPool } from '@/types';
import { getPoolScoreBreakdown } from '@/utils/yiieldScore';
import { getProtocolInfo } from '@/data/yiieldProtocols';
import { TeamVerificationStatus } from '@/types/yiieldScore';
import { getRatingColor, getSecurityRating } from '@/utils/security';

interface YiieldScoreTooltipProps {
  pool: YieldPool;
  children: React.ReactNode;
}

// Team badge component with distinct styling for each verification level
function TeamBadge({ status }: { status: TeamVerificationStatus }) {
  const config = {
    doxxed: {
      label: 'Public Team',
      description: 'Fully doxxed & publicly known',
      bg: 'bg-green-500/20',
      border: 'border-green-500/40',
      text: 'text-green-400',
      icon: '👤',
    },
    verified: {
      label: 'Yiield Verified',
      description: 'Personally verified by Yiield',
      bg: 'bg-purple-500/20',
      border: 'border-purple-500/40',
      text: 'text-purple-400',
      icon: '✓',
    },
    anonymous: {
      label: 'Anonymous',
      description: 'Team identity unknown',
      bg: 'bg-gray-500/20',
      border: 'border-gray-500/40',
      text: 'text-gray-400',
      icon: '👻',
    },
  }[status];

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${config.bg} border ${config.border}`}>
      <span className="text-base">{config.icon}</span>
      <div>
        <div className={`text-xs font-semibold ${config.text}`}>{config.label}</div>
        <div className="text-[10px] text-white/50">{config.description}</div>
      </div>
    </div>
  );
}

// Visual score breakdown bar
function ScoreBreakdownBar({
  baseScore,
  bonuses,
  total
}: {
  baseScore: number;
  bonuses: { label: string; value: number; color: string }[];
  total: number;
}) {
  const maxScore = 100;
  const baseWidth = (baseScore / maxScore) * 100;

  return (
    <div className="space-y-2">
      {/* Score bar */}
      <div className="h-3 bg-white/10 rounded-full overflow-hidden flex">
        {/* Base score segment */}
        <div
          className="h-full bg-white/30 transition-all"
          style={{ width: `${baseWidth}%` }}
        />
        {/* Bonus segments */}
        {bonuses.map((bonus, i) => (
          <div
            key={i}
            className="h-full transition-all"
            style={{
              width: `${(bonus.value / maxScore) * 100}%`,
              backgroundColor: bonus.color,
            }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px]">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-white/30" />
          <span className="text-white/50">Base {baseScore}</span>
        </div>
        {bonuses.map((bonus, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: bonus.color }} />
            <span className="text-white/50">{bonus.label} +{bonus.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function YiieldScoreTooltip({ pool, children }: YiieldScoreTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const protocolInfo = getProtocolInfo(pool.protocol);
  const scoreBreakdown = getPoolScoreBreakdown(pool);
  const yiieldScore = pool.yiieldScore || pool.securityScore;
  const rating = getSecurityRating(yiieldScore);
  const ratingColor = getRatingColor(rating);

  // Build bonuses array for the bar
  const bonuses: { label: string; value: number; color: string }[] = [];
  if (scoreBreakdown.auditorTierBonus > 0) {
    bonuses.push({ label: 'Audits', value: scoreBreakdown.auditorTierBonus, color: '#22c55e' });
  }
  if (scoreBreakdown.teamVerificationBonus > 0) {
    bonuses.push({ label: 'Team', value: scoreBreakdown.teamVerificationBonus, color: '#a855f7' });
  }
  if (scoreBreakdown.insuranceBonus > 0) {
    bonuses.push({ label: 'Insurance', value: scoreBreakdown.insuranceBonus, color: '#3b82f6' });
  }
  if (scoreBreakdown.governanceBonus > 0) {
    bonuses.push({ label: 'Gov', value: scoreBreakdown.governanceBonus, color: '#f59e0b' });
  }

  const hasBonus = bonuses.length > 0;

  // Calculate position when opening
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const tooltipWidth = 256; // w-64 = 16rem = 256px

      // Position tooltip to the left of the trigger, aligned with bottom
      let left = rect.right - tooltipWidth;
      const top = rect.bottom + 8;

      // Ensure tooltip doesn't go off the left edge
      if (left < 16) {
        left = 16;
      }

      setPosition({ top, left });
    }
  }, [isOpen]);

  return (
    <div
      ref={triggerRef}
      className="inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {children}

      {isOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed z-[9999] w-64 p-4 rounded-xl shadow-2xl pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(30, 30, 46, 0.98) 0%, rgba(20, 20, 32, 0.98) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            top: position.top,
            left: position.left,
          }}
        >
          {/* Main Score Display - THE ANSWER */}
          <div className="text-center mb-4">
            <div className="text-xs text-white/50 uppercase tracking-wider mb-1">Yiield Score</div>
            <div
              className="text-4xl font-bold"
              style={{ color: ratingColor }}
            >
              {Math.round(yiieldScore)}
            </div>
            <div
              className="text-xs font-medium mt-1"
              style={{ color: ratingColor }}
            >
              {rating === 'excellent' && 'Excellent'}
              {rating === 'good' && 'Good'}
              {rating === 'moderate' && 'Moderate'}
              {rating === 'risky' && 'Risky'}
              {rating === 'danger' && 'High Risk'}
            </div>
          </div>

          {/* Visual Breakdown Bar - THE WHY */}
          {hasBonus && (
            <div className="mb-4 pb-4 border-b border-white/10">
              <ScoreBreakdownBar
                baseScore={scoreBreakdown.baseScore}
                bonuses={bonuses}
                total={Math.round(yiieldScore)}
              />
            </div>
          )}

          {/* Team Verification Badge */}
          {protocolInfo && (
            <TeamBadge status={protocolInfo.teamStatus} />
          )}
        </div>,
        document.body
      )}
    </div>
  );
}
