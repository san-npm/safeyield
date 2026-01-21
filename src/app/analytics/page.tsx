'use client';

import { useState, useMemo } from 'react';
import { usePools } from '@/hooks/usePools';
import { YieldPool, StablecoinType } from '@/types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Color palette for charts
const COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1',
];

const STABLECOIN_COLORS: Record<string, string> = {
  USDC: '#2775ca',
  USDT: '#26a17b',
  DAI: '#f5ac37',
  PYUSD: '#0066cc',
  USDe: '#1a1a2e',
  USDS: '#00d395',
  EURC: '#0052ff',
  EURe: '#1a56db',
};

export default function AnalyticsPage() {
  const { pools, isLoading } = usePools();
  const [selectedStablecoin, setSelectedStablecoin] = useState<string>('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('7d');

  // Get unique stablecoins
  const stablecoins = useMemo(() => {
    const set = new Set(pools.map(p => p.stablecoin));
    return ['all', ...Array.from(set).sort()];
  }, [pools]);

  // Filter pools by stablecoin
  const filteredPools = useMemo(() => {
    if (selectedStablecoin === 'all') return pools;
    return pools.filter(p => p.stablecoin === selectedStablecoin);
  }, [pools, selectedStablecoin]);

  // Aggregate data by stablecoin
  const stablecoinStats = useMemo(() => {
    const stats: Record<string, { tvl: number; avgApy: number; poolCount: number }> = {};

    pools.forEach(pool => {
      if (!stats[pool.stablecoin]) {
        stats[pool.stablecoin] = { tvl: 0, avgApy: 0, poolCount: 0 };
      }
      stats[pool.stablecoin].tvl += pool.tvl;
      stats[pool.stablecoin].avgApy += pool.apy;
      stats[pool.stablecoin].poolCount += 1;
    });

    return Object.entries(stats)
      .map(([stablecoin, data]) => ({
        stablecoin,
        tvl: data.tvl,
        avgApy: data.avgApy / data.poolCount,
        poolCount: data.poolCount,
      }))
      .sort((a, b) => b.tvl - a.tvl);
  }, [pools]);

  // Aggregate data by protocol
  const protocolStats = useMemo(() => {
    const stats: Record<string, { tvl: number; avgApy: number; poolCount: number; securityScore: number }> = {};

    pools.forEach(pool => {
      if (!stats[pool.protocol]) {
        stats[pool.protocol] = { tvl: 0, avgApy: 0, poolCount: 0, securityScore: 0 };
      }
      stats[pool.protocol].tvl += pool.tvl;
      stats[pool.protocol].avgApy += pool.apy;
      stats[pool.protocol].securityScore += pool.securityScore;
      stats[pool.protocol].poolCount += 1;
    });

    return Object.entries(stats)
      .map(([protocol, data]) => ({
        protocol,
        tvl: data.tvl,
        avgApy: data.avgApy / data.poolCount,
        avgSecurityScore: data.securityScore / data.poolCount,
        poolCount: data.poolCount,
      }))
      .sort((a, b) => b.tvl - a.tvl);
  }, [pools]);

  // Top pools by APY
  const topPoolsByApy = useMemo(() => {
    return [...filteredPools]
      .sort((a, b) => b.apy - a.apy)
      .slice(0, 10);
  }, [filteredPools]);

  // Top pools by TVL
  const topPoolsByTvl = useMemo(() => {
    return [...filteredPools]
      .sort((a, b) => b.tvl - a.tvl)
      .slice(0, 10);
  }, [filteredPools]);

  // TVL distribution pie chart data
  const tvlDistribution = useMemo(() => {
    return stablecoinStats.slice(0, 8).map(s => ({
      name: s.stablecoin,
      value: s.tvl,
    }));
  }, [stablecoinStats]);

  // Total stats
  const totalStats = useMemo(() => {
    const totalTvl = pools.reduce((sum, p) => sum + p.tvl, 0);
    const avgApy = pools.length > 0 ? pools.reduce((sum, p) => sum + p.apy, 0) / pools.length : 0;
    const avgSecurityScore = pools.length > 0 ? pools.reduce((sum, p) => sum + p.securityScore, 0) / pools.length : 0;
    return { totalTvl, avgApy, avgSecurityScore, poolCount: pools.length };
  }, [pools]);

  const formatTvl = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-xl">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Yield Analytics</h1>
          <p className="text-gray-400">Track stablecoin yields across DeFi protocols</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">Total TVL</div>
            <div className="text-2xl font-bold text-green-400">{formatTvl(totalStats.totalTvl)}</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">Average APY</div>
            <div className="text-2xl font-bold text-blue-400">{totalStats.avgApy.toFixed(2)}%</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">Avg Security Score</div>
            <div className="text-2xl font-bold text-purple-400">{totalStats.avgSecurityScore.toFixed(0)}/100</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">Total Pools</div>
            <div className="text-2xl font-bold text-yellow-400">{totalStats.poolCount}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-8">
          <select
            value={selectedStablecoin}
            onChange={(e) => setSelectedStablecoin(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
          >
            {stablecoins.map(s => (
              <option key={s} value={s}>{s === 'all' ? 'All Stablecoins' : s}</option>
            ))}
          </select>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* TVL by Stablecoin */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">TVL by Stablecoin</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={tvlDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {tvlDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={STABLECOIN_COLORS[entry.name] || COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatTvl(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* APY by Stablecoin */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Average APY by Stablecoin</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stablecoinStats.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="stablecoin" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" tickFormatter={(v) => `${v.toFixed(1)}%`} />
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(2)}%`, 'Avg APY']}
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                />
                <Bar dataKey="avgApy" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Protocol Leaderboard */}
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 mb-8">
          <h2 className="text-xl font-semibold mb-4">Protocol Leaderboard</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-700">
                  <th className="pb-3 pr-4">#</th>
                  <th className="pb-3 pr-4">Protocol</th>
                  <th className="pb-3 pr-4 text-right">TVL</th>
                  <th className="pb-3 pr-4 text-right">Avg APY</th>
                  <th className="pb-3 pr-4 text-right">Security</th>
                  <th className="pb-3 text-right">Pools</th>
                </tr>
              </thead>
              <tbody>
                {protocolStats.slice(0, 15).map((protocol, index) => (
                  <tr key={protocol.protocol} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                    <td className="py-3 pr-4 text-gray-400">{index + 1}</td>
                    <td className="py-3 pr-4 font-medium">{protocol.protocol}</td>
                    <td className="py-3 pr-4 text-right text-green-400">{formatTvl(protocol.tvl)}</td>
                    <td className="py-3 pr-4 text-right text-blue-400">{protocol.avgApy.toFixed(2)}%</td>
                    <td className="py-3 pr-4 text-right">
                      <span className={`${
                        protocol.avgSecurityScore >= 80 ? 'text-green-400' :
                        protocol.avgSecurityScore >= 60 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {protocol.avgSecurityScore.toFixed(0)}
                      </span>
                    </td>
                    <td className="py-3 text-right text-gray-400">{protocol.poolCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Pools */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top by APY */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Top 10 by APY</h2>
            <div className="space-y-3">
              {topPoolsByApy.map((pool, index) => (
                <div key={pool.id} className="flex items-center justify-between py-2 border-b border-gray-700/50">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 w-6">{index + 1}</span>
                    <div>
                      <div className="font-medium">{pool.protocol}</div>
                      <div className="text-sm text-gray-400">{pool.stablecoin} • {pool.chain}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-semibold">{pool.apy.toFixed(2)}%</div>
                    <div className="text-sm text-gray-400">{formatTvl(pool.tvl)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top by TVL */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Top 10 by TVL</h2>
            <div className="space-y-3">
              {topPoolsByTvl.map((pool, index) => (
                <div key={pool.id} className="flex items-center justify-between py-2 border-b border-gray-700/50">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 w-6">{index + 1}</span>
                    <div>
                      <div className="font-medium">{pool.protocol}</div>
                      <div className="text-sm text-gray-400">{pool.stablecoin} • {pool.chain}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-blue-400 font-semibold">{formatTvl(pool.tvl)}</div>
                    <div className="text-sm text-gray-400">{pool.apy.toFixed(2)}% APY</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stablecoin Comparison Table */}
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 mt-8">
          <h2 className="text-xl font-semibold mb-4">Stablecoin Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-700">
                  <th className="pb-3 pr-4">Stablecoin</th>
                  <th className="pb-3 pr-4 text-right">Total TVL</th>
                  <th className="pb-3 pr-4 text-right">Avg APY</th>
                  <th className="pb-3 pr-4 text-right">Best APY</th>
                  <th className="pb-3 text-right">Pools</th>
                </tr>
              </thead>
              <tbody>
                {stablecoinStats.map((stat) => {
                  const bestPool = pools
                    .filter(p => p.stablecoin === stat.stablecoin)
                    .sort((a, b) => b.apy - a.apy)[0];
                  return (
                    <tr key={stat.stablecoin} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                      <td className="py-3 pr-4">
                        <span
                          className="inline-block w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: STABLECOIN_COLORS[stat.stablecoin] || '#6b7280' }}
                        />
                        {stat.stablecoin}
                      </td>
                      <td className="py-3 pr-4 text-right text-green-400">{formatTvl(stat.tvl)}</td>
                      <td className="py-3 pr-4 text-right text-blue-400">{stat.avgApy.toFixed(2)}%</td>
                      <td className="py-3 pr-4 text-right">
                        {bestPool && (
                          <span className="text-yellow-400">
                            {bestPool.apy.toFixed(2)}% <span className="text-gray-400 text-sm">({bestPool.protocol})</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-right text-gray-400">{stat.poolCount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          Data refreshed hourly • Powered by DefiLlama & Protocol APIs
        </div>
      </div>
    </div>
  );
}
