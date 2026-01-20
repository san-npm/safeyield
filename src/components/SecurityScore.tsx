'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { SecurityRating, YieldPool } from '@/types';
import { getSecurityRating, getRatingColor, getRatingLabel } from '@/utils/security';
import { getProtocolInfo, YIIELD_PROTOCOLS } from '@/data/yiieldProtocols';
import { getTeamBadgeLabel, TeamVerificationStatus } from '@/types/yiieldScore';
import { Shield, Users, FileCheck, ShieldCheck, Building } from 'lucide-react';

interface SecurityScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showDetails?: boolean;
  audits?: number;
  protocolAge?: number;
  exploits?: number;
  tvl?: number;
}

export function SecurityScore({
  score,
  size = 'md',
  showLabel = true,
  showDetails = false,
  audits = 0,
  protocolAge = 0,
  exploits = 0,
  tvl = 0,
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
      <div className="relative" style={{ width: dimensions.size, height: dimensions.size }}>
        <svg
          width={dimensions.size}
          height={dimensions.size}
          className="transform -rotate-90"
        >
          <circle
            cx={dimensions.size / 2}
            cy={dimensions.size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={dimensions.stroke}
          />
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
            style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
          />
        </svg>
        <div
          className={`absolute inset-0 flex items-center justify-center font-bold ${dimensions.fontSize}`}
          style={{ color }}
        >
          {Math.round(score)}
        </div>
      </div>

      {(showLabel || showDetails) && (
        <div className="flex flex-col">
          {showLabel && (
            <span className="font-semibold text-sm" style={{ color }}>
              {label}
            </span>
          )}
          {showDetails && (
            <div className="text-xs text-white/50 space-y-0.5">
              {audits !== undefined && audits > 0 && (
                <div>{audits} audit{audits > 1 ? 's' : ''}</div>
              )}
              {protocolAge !== undefined && protocolAge > 0 && (
                <div>
                  {protocolAge > 365
                    ? `${Math.floor(protocolAge / 365)} year${Math.floor(protocolAge / 365) > 1 ? 's' : ''}`
                    : `${protocolAge} days`
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

// Badge with tooltip for tables
export function SecurityBadge({
  score,
  audits = 0,
  protocolAge = 0,
  exploits = 0,
  tvl = 0,
  protocol = ''
}: {
  score: number;
  audits?: number;
  protocolAge?: number;
  exploits?: number;
  tvl?: number;
  protocol?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const [tooltipStyle, setTooltipStyle] = useState<{ left: number; top: number }>({ left: 0, top: 0 });

  const rating = getSecurityRating(score);

  useEffect(() => {
    setMounted(true);
  }, []);

  const protocolInfo = useMemo(() => {
    if (!protocol) return undefined;
    return getProtocolInfo(protocol);
  }, [protocol]);

  const handleMouseEnter = () => {
    if (badgeRef.current) {
      const rect = badgeRef.current.getBoundingClientRect();
      const tooltipWidth = 320;
      const tooltipHeight = 350;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      let left = rect.right + 12;
      if (left + tooltipWidth > windowWidth - 20) {
        left = rect.left - tooltipWidth - 12;
      }
      if (left < 10) left = 10;

      let top = rect.top;
      if (top + tooltipHeight > windowHeight - 20) {
        top = windowHeight - tooltipHeight - 20;
      }
      if (top < 10) top = 10;

      setTooltipStyle({ left, top });
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const badgeClass = {
    excellent: 'badge-excellent',
    good: 'badge-good',
    moderate: 'badge-moderate',
    risky: 'badge-risky',
    danger: 'badge-danger',
  }[rating];

  const years = Math.floor(protocolAge / 365);

  const getTeamStatusColor = (status: TeamVerificationStatus) => {
    switch (status) {
      case 'doxxed': return 'text-green-400';
      case 'verified': return 'text-blue-400';
      case 'anonymous': return 'text-yellow-400';
    }
  };

  const tooltipContent = (
    <div
      className="fixed z-[99999] w-80 p-4 rounded-xl bg-[#1a1a2e] border border-white/20 shadow-2xl"
      style={{ left: tooltipStyle.left, top: tooltipStyle.top }}
    >
      <div className="text-sm font-semibold text-white mb-4 flex items-center gap-2 pb-3 border-b border-white/10">
        <Shield className="w-5 h-5 text-safe-400" />
        Security Overview
      </div>

      <div className="space-y-4 text-sm">
        {protocolInfo ? (
          <>
            <div className="flex items-start gap-3">
              <Users className="w-4 h-4 text-white/40 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-white/50 text-xs mb-1">Team</div>
                <div className={`font-medium ${getTeamStatusColor(protocolInfo.teamStatus)}`}>
                  {getTeamBadgeLabel(protocolInfo.teamStatus)}
                </div>
                {protocolInfo.teamDescription && (
                  <div className="text-white/40 text-xs mt-0.5">{protocolInfo.teamDescription}</div>
                )}
              </div>
            </div>

            {protocolInfo.auditors.length > 0 && (
              <div className="flex items-start gap-3">
                <FileCheck className="w-4 h-4 text-white/40 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-white/50 text-xs mb-1.5">Audits</div>
                  <div className="flex flex-wrap gap-1.5">
                    {protocolInfo.auditors.map((auditor, i) => (
                      <span
                        key={i}
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          auditor.tier === 1
                            ? 'bg-green-500/20 text-green-400'
                            : auditor.tier === 2
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-purple-500/20 text-purple-400'
                        }`}
                      >
                        {auditor.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {protocolInfo.insurance && (
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-white/40 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-white/50 text-xs mb-1">Insurance</div>
                  <div className="text-safe-400 font-medium">
                    {protocolInfo.insurance.provider}
                    <span className="text-white/40 font-normal text-xs ml-1">
                      (${(protocolInfo.insurance.coverage / 1_000_000).toFixed(0)}M)
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-white/40 text-xs py-2">
            Detailed security info not available
          </div>
        )}

        <div className="flex items-start gap-3">
          <Building className="w-4 h-4 text-white/40 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <div className="text-white/50 text-xs mb-1">Protocol Age</div>
            <div className="text-white font-medium">
              {years > 0 ? `${years} year${years > 1 ? 's' : ''}` : `${protocolAge} days`}
            </div>
          </div>
        </div>

        {exploits > 0 && (
          <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20">
            <div className="text-red-400 font-medium text-xs">
              ⚠ {exploits} exploit{exploits > 1 ? 's' : ''} recorded
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center">
        <span className="text-white font-semibold">Security Score</span>
        <span className="text-xl font-bold" style={{ color: getRatingColor(rating) }}>
          {Math.round(score)}/100
        </span>
      </div>
    </div>
  );

  return (
    <div className="relative inline-block">
      <span
        ref={badgeRef}
        className={`badge ${badgeClass} cursor-help`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {Math.round(score)}
      </span>
      {mounted && isHovered && createPortal(tooltipContent, document.body)}
    </div>
  );
}
