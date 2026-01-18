'use client';

import { TrendingUp, Shield, Layers, Wallet } from 'lucide-react';
import { formatNumber, formatPercent } from '@/utils/security';

interface StatsProps {
  totalTvl: number;
  avgApy: number;
  avgSecurity: number;
  poolCount: number;
  protocolCount: number;
}

export function Stats({ totalTvl, avgApy, avgSecurity, poolCount, protocolCount }: StatsProps) {
  const stats = [
    {
      label: 'TVL Total',
      value: formatNumber(totalTvl),
      icon: Wallet,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'APY Moyen',
      value: formatPercent(avgApy),
      icon: TrendingUp,
      color: 'text-safe-400',
      bgColor: 'bg-safe-500/10',
    },
    {
      label: 'Score Sécurité Moy.',
      value: Math.round(avgSecurity).toString(),
      icon: Shield,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
    {
      label: 'Pools Analysés',
      value: `${poolCount} / ${protocolCount} protocoles`,
      icon: Layers,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
    },
  ];

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="card p-4 flex items-center gap-4"
          >
            <div className={`p-3 rounded-xl ${stat.bgColor}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <div className="text-xs text-white/40 uppercase tracking-wide">
                {stat.label}
              </div>
              <div className="text-lg font-bold text-white">
                {stat.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
