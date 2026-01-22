'use client';

import { useState, useMemo, useEffect } from 'react';
import { usePools } from '@/hooks/usePools';
import { YieldPool } from '@/types';
import { Footer } from '@/components';
import { useI18n, I18nProvider, locales, localeFlags, localeNames, Locale, TranslationKey } from '@/utils/i18n';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Shield,
  Wallet,
  BarChart3,
  PieChart as PieChartIcon,
  ArrowLeft,
  RefreshCw,
  Clock,
  Layers,
  Award,
  Globe,
  Target,
  AlertTriangle,
  Calculator,
  Activity,
  Zap,
  CheckCircle,
  XCircle,
  Minus,
  Database,
  Github,
  Server,
  ExternalLink,
  Info,
  DollarSign,
  TrendingUp as GrowthIcon,
  GitCompare,
  Plus,
  X,
  Trophy,
} from 'lucide-react';

// ============================================
// LOGO COMPONENT
// ============================================

function YiieldLogo() {
  return (
    <div className="flex items-center h-8">
      <span className="text-2xl font-bold text-white leading-none">y</span>
      <div className="flex items-end gap-[3px] h-[22px] mx-[2px] mb-[1px]">
        <div className="w-[5px] h-[13px] bg-red-500 rounded-[2px]" />
        <div className="w-[5px] h-[19px] bg-safe-400 rounded-[2px]" />
      </div>
      <span className="text-2xl font-bold text-white leading-none">eld</span>
    </div>
  );
}

// ============================================
// LANGUAGE SELECTOR
// ============================================

function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { locale, setLocale } = useI18n();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm text-white/70"
      >
        <Globe className="w-4 h-4" />
        <span>{localeFlags[locale]} {locale.toUpperCase()}</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 bg-dark-900 border border-white/10 rounded-xl overflow-hidden min-w-[160px] shadow-xl">
            {locales.map(lang => (
              <button
                key={lang}
                onClick={() => { setLocale(lang); setIsOpen(false); }}
                className={`w-full px-4 py-3 text-left text-sm flex items-center gap-3 hover:bg-white/5 transition-colors
                           ${lang === locale ? 'bg-safe-500/10 text-safe-400' : 'text-white/70'}`}
              >
                <span>{localeFlags[lang]}</span>
                <span>{localeNames[lang]}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ============================================
// HEADER
// ============================================

function AnalyticsHeader({ onRefresh, isLoading }: { onRefresh: () => void; isLoading: boolean }) {
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-dark-950/80 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <a href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">{t('analytics.back')}</span>
            </a>
            <div className="h-6 w-px bg-white/10" />
            <YiieldLogo />
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs text-white/40">
              <BarChart3 className="w-4 h-4" />
              <span>{t('analytics.title')}</span>
            </div>
            <LanguageSelector />
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-white/70 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

// ============================================
// STAT CARD
// ============================================

function StatCard({
  icon: Icon,
  label,
  value,
  subValue,
  color = 'text-safe-400',
  trend,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  subValue?: string;
  color?: string;
  trend?: 'up' | 'down' | 'neutral';
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 rounded-lg bg-white/5">
          <Icon className={`w-4 h-4 ${color}`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs ${
            trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-white/40'
          }`}>
            {trend === 'up' ? <TrendingUp className="w-3 h-3" /> :
             trend === 'down' ? <TrendingDown className="w-3 h-3" /> :
             <Minus className="w-3 h-3" />}
          </div>
        )}
      </div>
      <div className={`text-xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-white/40 mt-1">{label}</div>
      {subValue && <div className="text-xs text-white/50 mt-1">{subValue}</div>}
    </div>
  );
}

// ============================================
// SECTION HEADER
// ============================================

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  color = 'text-safe-400'
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  color?: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 rounded-lg bg-white/5">
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <p className="text-sm text-white/40">{subtitle}</p>
      </div>
    </div>
  );
}

// ============================================
// COLORS
// ============================================

const STABLECOIN_COLORS: Record<string, string> = {
  USDC: '#2775ca',
  USDT: '#26a17b',
  DAI: '#f5ac37',
  PYUSD: '#0066cc',
  USDe: '#000000',
  USDS: '#00d395',
  USD1: '#ff6b35',
  USDG: '#1a1a2e',
  EURC: '#0052ff',
  EURe: '#1a56db',
  XAUT: '#d4af37',
  PAXG: '#e4b600',
};

const CHAIN_COLORS: Record<string, string> = {
  Ethereum: '#627eea',
  Arbitrum: '#28a0f0',
  Optimism: '#ff0420',
  Base: '#0052ff',
  Polygon: '#8247e5',
  BSC: '#f0b90b',
  Avalanche: '#e84142',
  Solana: '#14f195',
  Gnosis: '#04795b',
  Linea: '#61dfff',
};

const CHART_COLORS = [
  '#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1',
];

// ============================================
// HELPERS
// ============================================

const formatTvl = (value: number) => {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
};

const formatCompact = (value: number) => {
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return value.toFixed(0);
};

// ============================================
// MAIN PAGE
// ============================================

// Collector status interface
interface CollectorStatus {
  lastCollected: string | null;
  totalPools: number;
  isLoading: boolean;
  error: boolean;
}

const ALEPH_STORAGE_URL = 'https://api2.aleph.im/api/v0/storage/raw/';

function AnalyticsContent() {
  const { pools, isLoading, refresh } = usePools();
  const { t, locale } = useI18n();
  const [selectedStablecoin, setSelectedStablecoin] = useState<string>('all');
  const [calculatorAmount, setCalculatorAmount] = useState<number>(10000);

  // Growth Simulation state
  const [simAmount, setSimAmount] = useState<number>(10000);
  const [simPoolId, setSimPoolId] = useState<string>('');
  const [simTimeframe, setSimTimeframe] = useState<number>(12);
  const [simTimeUnit, setSimTimeUnit] = useState<'weeks' | 'months' | 'years'>('months');
  const [simCompoundFreq, setSimCompoundFreq] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Pool Comparison state
  const [comparisonPoolIds, setComparisonPoolIds] = useState<string[]>([]);

  const [collectorStatus, setCollectorStatus] = useState<CollectorStatus>({
    lastCollected: null,
    totalPools: 0,
    isLoading: true,
    error: false,
  });

  // Fetch collector status from Aleph
  // First fetches the hash dynamically from public file (updated by GitHub Actions)
  // Falls back to env var if dynamic fetch fails
  useEffect(() => {
    async function fetchCollectorStatus() {
      try {
        // Try to get hash dynamically from public file (updated by GitHub Actions)
        let hash = '';
        try {
          const hashResponse = await fetch('/apy-history-hash.txt');
          if (hashResponse.ok) {
            hash = (await hashResponse.text()).trim();
          }
        } catch {
          // Ignore fetch error, will fall back to env var
        }

        // Fall back to env var if dynamic fetch failed
        if (!hash) {
          hash = process.env.NEXT_PUBLIC_HISTORY_INDEX_HASH || '';
        }

        if (!hash) {
          setCollectorStatus(prev => ({ ...prev, isLoading: false, error: true }));
          return;
        }

        const response = await fetch(`${ALEPH_STORAGE_URL}${hash}`);
        if (!response.ok) throw new Error('Failed to fetch');

        const data = await response.json();
        setCollectorStatus({
          lastCollected: data.lastCollected,
          totalPools: data.totalPools || Object.keys(data.pools || {}).length,
          isLoading: false,
          error: false,
        });
      } catch (error) {
        console.warn('Failed to fetch collector status:', error);
        setCollectorStatus(prev => ({ ...prev, isLoading: false, error: true }));
      }
    }

    fetchCollectorStatus();
  }, []);

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

  // ============================================
  // AGGREGATE DATA
  // ============================================

  // Stablecoin stats
  const stablecoinStats = useMemo(() => {
    const stats: Record<string, { tvl: number; avgApy: number; poolCount: number; logo?: string; bestApy: number; bestProtocol: string }> = {};

    pools.forEach(pool => {
      if (!stats[pool.stablecoin]) {
        stats[pool.stablecoin] = { tvl: 0, avgApy: 0, poolCount: 0, logo: pool.stablecoinLogo, bestApy: 0, bestProtocol: '' };
      }
      stats[pool.stablecoin].tvl += pool.tvl;
      stats[pool.stablecoin].avgApy += pool.apy;
      stats[pool.stablecoin].poolCount += 1;
      if (pool.apy > stats[pool.stablecoin].bestApy) {
        stats[pool.stablecoin].bestApy = pool.apy;
        stats[pool.stablecoin].bestProtocol = pool.protocol;
      }
    });

    return Object.entries(stats)
      .map(([stablecoin, data]) => ({
        stablecoin,
        tvl: data.tvl,
        avgApy: data.avgApy / data.poolCount,
        poolCount: data.poolCount,
        logo: data.logo,
        bestApy: data.bestApy,
        bestProtocol: data.bestProtocol,
      }))
      .sort((a, b) => b.tvl - a.tvl);
  }, [pools]);

  // Protocol stats
  const protocolStats = useMemo(() => {
    const stats: Record<string, {
      tvl: number;
      avgApy: number;
      minApy: number;
      maxApy: number;
      poolCount: number;
      securityScore: number;
      logo?: string;
      chains: Set<string>;
      type?: string;
    }> = {};

    pools.forEach(pool => {
      if (!stats[pool.protocol]) {
        stats[pool.protocol] = {
          tvl: 0,
          avgApy: 0,
          minApy: Infinity,
          maxApy: -Infinity,
          poolCount: 0,
          securityScore: 0,
          logo: pool.protocolLogo,
          chains: new Set(),
          type: pool.protocolType,
        };
      }
      stats[pool.protocol].tvl += pool.tvl;
      stats[pool.protocol].avgApy += pool.apy;
      stats[pool.protocol].minApy = Math.min(stats[pool.protocol].minApy, pool.apy);
      stats[pool.protocol].maxApy = Math.max(stats[pool.protocol].maxApy, pool.apy);
      stats[pool.protocol].securityScore += pool.securityScore;
      stats[pool.protocol].poolCount += 1;
      stats[pool.protocol].chains.add(pool.chain);
    });

    return Object.entries(stats)
      .map(([protocol, data]) => ({
        protocol,
        tvl: data.tvl,
        avgApy: data.avgApy / data.poolCount,
        minApy: data.minApy === Infinity ? 0 : data.minApy,
        maxApy: data.maxApy === -Infinity ? 0 : data.maxApy,
        avgSecurityScore: data.securityScore / data.poolCount,
        poolCount: data.poolCount,
        logo: data.logo,
        chainCount: data.chains.size,
        type: data.type,
      }))
      .sort((a, b) => b.tvl - a.tvl);
  }, [pools]);

  // Chain stats
  const chainStats = useMemo(() => {
    const stats: Record<string, { tvl: number; avgApy: number; poolCount: number; logo?: string; bestApy: number; bestProtocol: string }> = {};

    pools.forEach(pool => {
      if (!stats[pool.chain]) {
        stats[pool.chain] = { tvl: 0, avgApy: 0, poolCount: 0, logo: pool.chainLogo, bestApy: 0, bestProtocol: '' };
      }
      stats[pool.chain].tvl += pool.tvl;
      stats[pool.chain].avgApy += pool.apy;
      stats[pool.chain].poolCount += 1;
      if (pool.apy > stats[pool.chain].bestApy) {
        stats[pool.chain].bestApy = pool.apy;
        stats[pool.chain].bestProtocol = pool.protocol;
      }
    });

    return Object.entries(stats)
      .map(([chain, data]) => ({
        chain,
        tvl: data.tvl,
        avgApy: data.avgApy / data.poolCount,
        poolCount: data.poolCount,
        logo: data.logo,
        bestApy: data.bestApy,
        bestProtocol: data.bestProtocol,
      }))
      .sort((a, b) => b.tvl - a.tvl);
  }, [pools]);

  // Protocol type stats
  const protocolTypeStats = useMemo(() => {
    const lending = pools.filter(p => p.protocolType === 'lending');
    const vault = pools.filter(p => p.protocolType === 'vault');

    return [
      {
        type: 'Lending',
        count: lending.length,
        tvl: lending.reduce((sum, p) => sum + p.tvl, 0),
        avgApy: lending.length > 0 ? lending.reduce((sum, p) => sum + p.apy, 0) / lending.length : 0,
        avgSecurity: lending.length > 0 ? lending.reduce((sum, p) => sum + p.securityScore, 0) / lending.length : 0,
      },
      {
        type: 'Vault',
        count: vault.length,
        tvl: vault.reduce((sum, p) => sum + p.tvl, 0),
        avgApy: vault.length > 0 ? vault.reduce((sum, p) => sum + p.apy, 0) / vault.length : 0,
        avgSecurity: vault.length > 0 ? vault.reduce((sum, p) => sum + p.securityScore, 0) / vault.length : 0,
      },
    ];
  }, [pools]);

  // Security distribution
  const securityDistribution = useMemo(() => {
    const ranges = [
      { label: 'Excellent (80-100)', min: 80, max: 100, color: '#22c55e' },
      { label: 'Good (60-79)', min: 60, max: 79, color: '#84cc16' },
      { label: 'Moderate (40-59)', min: 40, max: 59, color: '#f59e0b' },
      { label: 'Risky (20-39)', min: 20, max: 39, color: '#f97316' },
      { label: 'Danger (0-19)', min: 0, max: 19, color: '#ef4444' },
    ];

    return ranges.map(range => ({
      ...range,
      count: pools.filter(p => p.securityScore >= range.min && p.securityScore <= range.max).length,
    }));
  }, [pools]);

  // Risk vs Return data (scatter plot)
  const riskReturnData = useMemo(() => {
    return filteredPools.map(pool => ({
      x: pool.securityScore,
      y: pool.apy,
      z: pool.tvl,
      name: pool.protocol,
      stablecoin: pool.stablecoin,
      chain: pool.chain,
    }));
  }, [filteredPools]);

  // TVL changes (gainers/losers)
  const tvlChanges = useMemo(() => {
    const withChanges = pools
      .filter(p => p.tvlChange24h !== 0)
      .map(p => ({
        ...p,
        changePercent: p.tvlChange24h,
      }))
      .sort((a, b) => b.changePercent - a.changePercent);

    return {
      gainers: withChanges.filter(p => p.changePercent > 0).slice(0, 5),
      losers: withChanges.filter(p => p.changePercent < 0).slice(-5).reverse(),
    };
  }, [pools]);

  // High APY alerts (potential risks)
  const highApyAlerts = useMemo(() => {
    return pools
      .filter(p => p.apy > 15)
      .sort((a, b) => b.apy - a.apy)
      .slice(0, 5);
  }, [pools]);

  // APY History trends (aggregate by day from pool histories)
  const apyTrends = useMemo(() => {
    // Get pools with history
    const poolsWithHistory = pools.filter(p => p.apyHistory && p.apyHistory.length > 1);
    if (poolsWithHistory.length === 0) return [];

    // Group by approximate time buckets (last 7 days)
    const now = new Date();
    const trends: { date: string; avgApy: number; count: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      let totalApy = 0;
      let count = 0;

      poolsWithHistory.forEach(pool => {
        if (pool.apyHistory && pool.apyHistory.length > i) {
          const idx = pool.apyHistory.length - 1 - i;
          if (idx >= 0) {
            totalApy += pool.apyHistory[idx].apy;
            count++;
          }
        }
      });

      if (count > 0) {
        trends.push({ date: dateStr, avgApy: totalApy / count, count });
      }
    }

    return trends;
  }, [pools]);

  // Calculator results
  const calculatorResults = useMemo(() => {
    const topPools = [...filteredPools]
      .sort((a, b) => b.apy - a.apy)
      .slice(0, 5)
      .map(pool => ({
        protocol: pool.protocol,
        stablecoin: pool.stablecoin,
        chain: pool.chain,
        apy: pool.apy,
        securityScore: pool.securityScore,
        logo: pool.protocolLogo,
        dailyEarnings: (calculatorAmount * (pool.apy / 100)) / 365,
        monthlyEarnings: (calculatorAmount * (pool.apy / 100)) / 12,
        yearlyEarnings: calculatorAmount * (pool.apy / 100),
      }));
    return topPools;
  }, [filteredPools, calculatorAmount]);

  // Total stats
  const totalStats = useMemo(() => {
    const totalTvl = pools.reduce((sum, p) => sum + p.tvl, 0);
    const avgApy = pools.length > 0 ? pools.reduce((sum, p) => sum + p.apy, 0) / pools.length : 0;
    const avgSecurityScore = pools.length > 0 ? pools.reduce((sum, p) => sum + p.securityScore, 0) / pools.length : 0;
    const uniqueProtocols = new Set(pools.map(p => p.protocol)).size;
    const uniqueChains = new Set(pools.map(p => p.chain)).size;
    const highSecurityPools = pools.filter(p => p.securityScore >= 80).length;
    return { totalTvl, avgApy, avgSecurityScore, poolCount: pools.length, protocolCount: uniqueProtocols, chainCount: uniqueChains, highSecurityPools };
  }, [pools]);

  // Top pools
  const topPoolsByApy = useMemo(() => [...filteredPools].sort((a, b) => b.apy - a.apy).slice(0, 10), [filteredPools]);
  const topPoolsByTvl = useMemo(() => [...filteredPools].sort((a, b) => b.tvl - a.tvl).slice(0, 10), [filteredPools]);

  // YPO (Yield Paid Out) Leaderboard - estimates cumulative yield based on TVL × APY
  const ypoLeaderboard = useMemo(() => {
    return [...pools]
      .map(pool => {
        const dailyYield = pool.tvl * (pool.apy / 100) / 365;
        return {
          ...pool,
          ypo7d: dailyYield * 7,
          ypo30d: dailyYield * 30,
          ypo365d: dailyYield * 365,
        };
      })
      .sort((a, b) => b.ypo30d - a.ypo30d)
      .slice(0, 10);
  }, [pools]);

  // Growth Simulation data
  const simulationData = useMemo(() => {
    const selectedPool = pools.find(p => p.id === simPoolId);
    if (!selectedPool || simAmount <= 0) return null;

    const apy = selectedPool.apy / 100;
    let periods: number;
    let periodsPerYear: number;

    // Convert timeframe to number of periods
    switch (simTimeUnit) {
      case 'weeks':
        periods = simTimeframe;
        break;
      case 'months':
        periods = simTimeframe;
        break;
      case 'years':
        periods = simTimeframe * 12; // Convert to months for chart
        break;
    }

    // Compound frequency
    switch (simCompoundFreq) {
      case 'daily':
        periodsPerYear = 365;
        break;
      case 'weekly':
        periodsPerYear = 52;
        break;
      case 'monthly':
        periodsPerYear = 12;
        break;
    }

    // Calculate total time in years
    let totalYears: number;
    switch (simTimeUnit) {
      case 'weeks':
        totalYears = simTimeframe / 52;
        break;
      case 'months':
        totalYears = simTimeframe / 12;
        break;
      case 'years':
        totalYears = simTimeframe;
        break;
    }

    // Final value with compound interest: P * (1 + r/n)^(n*t)
    const n = periodsPerYear;
    const t = totalYears;
    const finalValue = simAmount * Math.pow(1 + apy / n, n * t);
    const totalEarnings = finalValue - simAmount;

    // Generate chart data points (monthly intervals)
    const chartData: { month: number; value: number; label: string }[] = [];
    const totalMonths = simTimeUnit === 'weeks' ? Math.ceil(simTimeframe / 4) :
                        simTimeUnit === 'months' ? simTimeframe :
                        simTimeframe * 12;

    for (let m = 0; m <= Math.min(totalMonths, 60); m += Math.max(1, Math.floor(totalMonths / 12))) {
      const yearsElapsed = m / 12;
      const value = simAmount * Math.pow(1 + apy / n, n * yearsElapsed);
      chartData.push({
        month: m,
        value,
        label: m === 0 ? 'Start' : m < 12 ? `${m}mo` : `${(m / 12).toFixed(1)}y`,
      });
    }

    return {
      pool: selectedPool,
      initialAmount: simAmount,
      finalValue,
      totalEarnings,
      effectiveApy: ((finalValue / simAmount - 1) / totalYears) * 100,
      chartData,
    };
  }, [pools, simPoolId, simAmount, simTimeframe, simTimeUnit, simCompoundFreq]);

  // Pool Comparison data
  const comparisonPools = useMemo(() => {
    return comparisonPoolIds
      .map(id => pools.find(p => p.id === id))
      .filter((p): p is YieldPool => p !== undefined)
      .map(pool => {
        // Calculate 7d average APY from history if available
        const history = pool.apyHistory || [];
        const last7Days = history.slice(-7);
        const avgApy7d = last7Days.length > 0
          ? last7Days.reduce((sum, h) => sum + h.apy, 0) / last7Days.length
          : pool.apy;

        // Calculate volatility (std deviation of APY)
        let volatility = 0;
        if (last7Days.length > 1) {
          const mean = avgApy7d;
          const squaredDiffs = last7Days.map(h => Math.pow(h.apy - mean, 2));
          volatility = Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / last7Days.length);
        }

        // Calculate trend
        const trend = last7Days.length >= 2
          ? last7Days[last7Days.length - 1].apy - last7Days[0].apy
          : 0;

        return {
          ...pool,
          avgApy7d,
          volatility,
          trend,
        };
      });
  }, [pools, comparisonPoolIds]);

  // TVL distribution for pie chart
  const tvlDistribution = useMemo(() => stablecoinStats.slice(0, 8).map(s => ({ name: s.stablecoin, value: s.tvl })), [stablecoinStats]);
  const chainTvlDistribution = useMemo(() => chainStats.slice(0, 8).map(s => ({ name: s.chain, value: s.tvl })), [chainStats]);

  // ============================================
  // RENDER
  // ============================================

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <AnalyticsHeader onRefresh={refresh} isLoading={isLoading} />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <RefreshCw className="w-8 h-8 text-safe-400 animate-spin" />
            <span className="text-white/60">{t('analytics.loading')}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AnalyticsHeader onRefresh={refresh} isLoading={isLoading} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-safe-500/5 via-transparent to-transparent" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {t('analytics.heroTitle1')} <span className="text-gradient">{t('analytics.heroTitle2')}</span>
              </h1>
              <p className="text-white/60 leading-relaxed">
                {t('analytics.heroSubtitle').replace('{chains}', String(totalStats.chainCount)).replace('{protocols}', String(totalStats.protocolCount))}
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
            <StatCard icon={Wallet} label={t('analytics.totalTvl')} value={formatTvl(totalStats.totalTvl)} color="text-green-400" />
            <StatCard icon={TrendingUp} label={t('analytics.avgApy')} value={`${totalStats.avgApy.toFixed(2)}%`} color="text-safe-400" />
            <StatCard icon={Shield} label={t('analytics.avgSecurity')} value={`${totalStats.avgSecurityScore.toFixed(0)}`} color="text-purple-400" />
            <StatCard icon={Layers} label={t('analytics.totalPools')} value={totalStats.poolCount.toString()} color="text-blue-400" />
            <StatCard icon={Award} label={t('analytics.protocols')} value={totalStats.protocolCount.toString()} color="text-yellow-400" />
            <StatCard icon={Globe} label={t('analytics.chains')} value={totalStats.chainCount.toString()} color="text-orange-400" />
            <StatCard icon={CheckCircle} label={t('analytics.safePools')} value={totalStats.highSecurityPools.toString()} color="text-emerald-400" />
          </div>

          {/* Filter */}
          <div className="mb-8">
            <div className="card p-4 inline-flex items-center gap-4">
              <span className="text-sm text-white/50">{t('analytics.filterBy')}</span>
              <select
                value={selectedStablecoin}
                onChange={(e) => setSelectedStablecoin(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-safe-400/50"
              >
                {stablecoins.map(s => (
                  <option key={s} value={s} className="bg-dark-900">
                    {s === 'all' ? t('analytics.allStablecoins') : s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 1: TVL Distribution Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* TVL by Stablecoin */}
            <div className="card p-6">
              <SectionHeader icon={PieChartIcon} title={t('analytics.tvlByStablecoin')} subtitle={t('analytics.distributionAssets')} color="text-safe-400" />
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={tvlDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                    {tvlDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STABLECOIN_COLORS[entry.name] || CHART_COLORS[index % CHART_COLORS.length]} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatTvl(value)}
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', padding: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}
                    labelStyle={{ color: '#fff', fontWeight: 600 }}
                    itemStyle={{ color: '#22c55e' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
                {tvlDistribution.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: STABLECOIN_COLORS[item.name] || CHART_COLORS[index % CHART_COLORS.length] }} />
                    <span className="text-white/70">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* TVL by Chain */}
            <div className="card p-6">
              <SectionHeader icon={Globe} title={t('analytics.tvlByChain')} subtitle={t('analytics.distributionNetworks')} color="text-blue-400" />
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={chainTvlDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                    {chainTvlDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHAIN_COLORS[entry.name] || CHART_COLORS[index % CHART_COLORS.length]} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatTvl(value)}
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', padding: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}
                    labelStyle={{ color: '#fff', fontWeight: 600 }}
                    itemStyle={{ color: '#3b82f6' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
                {chainTvlDistribution.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHAIN_COLORS[item.name] || CHART_COLORS[index % CHART_COLORS.length] }} />
                    <span className="text-white/70">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: Risk vs Return & APY Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Risk vs Return Scatter Plot */}
            <div className="card p-6">
              <SectionHeader icon={Target} title={t('analytics.riskVsReturn')} subtitle={t('analytics.riskVsReturnDesc')} color="text-purple-400" />
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Security"
                    domain={[0, 100]}
                    stroke="rgba(255,255,255,0.4)"
                    tick={{ fontSize: 11 }}
                    label={{ value: 'Security Score', position: 'bottom', offset: 0, fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="APY"
                    stroke="rgba(255,255,255,0.4)"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                    label={{ value: 'APY %', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                  />
                  <ZAxis type="number" dataKey="z" range={[50, 400]} />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-gray-800 border border-white/20 rounded-lg p-3 shadow-xl">
                            <p className="text-white font-medium">{data.name}</p>
                            <p className="text-white/60 text-sm">{data.stablecoin} • {data.chain}</p>
                            <p className="text-safe-400 text-sm mt-1">APY: {data.y.toFixed(2)}%</p>
                            <p className="text-purple-400 text-sm">Security: {data.x}</p>
                            <p className="text-blue-400 text-sm">TVL: {formatTvl(data.z)}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter data={riskReturnData} fill="#22c55e" fillOpacity={0.6} />
                </ScatterChart>
              </ResponsiveContainer>
              <div className="mt-4 text-xs text-white/40 text-center">
                {t('analytics.optimalZone')}
              </div>
            </div>

            {/* APY Trends */}
            <div className="card p-6">
              <SectionHeader icon={Activity} title={t('analytics.apyTrends')} subtitle={t('analytics.apyTrendsDesc')} color="text-orange-400" />
              {apyTrends.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={apyTrends} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <defs>
                      <linearGradient id="apyGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 11 }} />
                    <YAxis stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v.toFixed(1)}%`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1f2937', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', padding: '12px' }}
                      formatter={(value: number) => [`${value.toFixed(2)}%`, 'Avg APY']}
                    />
                    <Area type="monotone" dataKey="avgApy" stroke="#22c55e" strokeWidth={2} fill="url(#apyGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-white/40">
                  <div className="text-center">
                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>{t('analytics.historicalDataCollecting')}</p>
                    <p className="text-xs mt-1">{t('analytics.checkBackLater')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Row 3: Protocol Type & Security Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Protocol Type Comparison */}
            <div className="card p-6">
              <SectionHeader icon={Layers} title={t('analytics.lendingVsVaults')} subtitle={t('analytics.protocolTypeComparison')} color="text-cyan-400" />
              <div className="grid grid-cols-2 gap-4">
                {protocolTypeStats.map((stat) => (
                  <div key={stat.type} className={`p-4 rounded-xl ${stat.type === 'Lending' ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-purple-500/10 border border-purple-500/20'}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`p-1.5 rounded-lg ${stat.type === 'Lending' ? 'bg-blue-500/20' : 'bg-purple-500/20'}`}>
                        {stat.type === 'Lending' ? <Wallet className="w-4 h-4 text-blue-400" /> : <Layers className="w-4 h-4 text-purple-400" />}
                      </div>
                      <span className={`font-semibold ${stat.type === 'Lending' ? 'text-blue-400' : 'text-purple-400'}`}>{stat.type === 'Lending' ? t('analytics.lending') : t('analytics.vault')}</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/50">{t('analytics.pools')}</span>
                        <span className="text-white font-medium">{stat.count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/50">{t('analytics.tvl')}</span>
                        <span className="text-green-400 font-medium">{formatTvl(stat.tvl)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/50">{t('analytics.avgApy')}</span>
                        <span className="text-safe-400 font-medium">{stat.avgApy.toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/50">{t('analytics.avgSecurity')}</span>
                        <span className="text-yellow-400 font-medium">{stat.avgSecurity.toFixed(0)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Score Distribution */}
            <div className="card p-6">
              <SectionHeader icon={Shield} title={t('analytics.securityDistribution')} subtitle={t('analytics.securityDistributionDesc')} color="text-emerald-400" />
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={securityDistribution} layout="vertical" margin={{ left: 10, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                  <XAxis type="number" stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="label" stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 10 }} width={100} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', padding: '12px' }}
                    formatter={(value: number) => [`${value} pools`, 'Count']}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {securityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-5 gap-2">
                {securityDistribution.map((item) => (
                  <div key={item.label} className="text-center">
                    <div className="text-lg font-bold" style={{ color: item.color }}>{item.count}</div>
                    <div className="text-[10px] text-white/40">{item.label.split(' ')[0]}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 4: Best Yield by Chain */}
          <div className="card mb-6 overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <SectionHeader icon={Zap} title={t('analytics.bestYieldByChain')} subtitle={t('analytics.bestYieldByChainDesc')} color="text-yellow-400" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-white/40 uppercase tracking-wider border-b border-white/5">
                    <th className="px-6 py-4 font-medium">{t('analytics.chain')}</th>
                    <th className="px-6 py-4 font-medium text-right">{t('analytics.bestApy')}</th>
                    <th className="px-6 py-4 font-medium">{t('analytics.bestProtocol')}</th>
                    <th className="px-6 py-4 font-medium text-right">{t('analytics.totalTvlCol')}</th>
                    <th className="px-6 py-4 font-medium text-right">{t('analytics.avgApyCol')}</th>
                    <th className="px-6 py-4 font-medium text-right">{t('analytics.opportunities')}</th>
                  </tr>
                </thead>
                <tbody>
                  {chainStats.map((stat) => (
                    <tr key={stat.chain} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {stat.logo ? (
                            <img src={stat.logo} alt={stat.chain} className="w-6 h-6 rounded-full" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                          ) : (
                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: CHAIN_COLORS[stat.chain] || '#6b7280' }}>
                              {stat.chain.charAt(0)}
                            </div>
                          )}
                          <span className="font-medium text-white">{stat.chain}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-yellow-400 font-bold">{stat.bestApy.toFixed(2)}%</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white/70">{stat.bestProtocol}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-green-400 font-medium">{formatTvl(stat.tvl)}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-safe-400 font-medium">{stat.avgApy.toFixed(2)}%</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-white/60">{stat.poolCount}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Row 5: Yield Calculator */}
          <div className="card mb-6 p-6">
            <SectionHeader icon={Calculator} title={t('analytics.yieldCalculator')} subtitle={t('analytics.yieldCalculatorDesc')} color="text-pink-400" />
            <div className="mb-6">
              <label className="block text-sm text-white/50 mb-2">{t('analytics.investmentAmount')}</label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={calculatorAmount}
                  onChange={(e) => setCalculatorAmount(Math.max(0, Number(e.target.value)))}
                  className="w-48 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-lg font-medium focus:outline-none focus:border-safe-400/50"
                />
                <div className="flex gap-2">
                  {[1000, 10000, 50000, 100000].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setCalculatorAmount(amount)}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        calculatorAmount === amount ? 'bg-safe-500/20 text-safe-400 border border-safe-500/30' : 'bg-white/5 text-white/50 hover:bg-white/10'
                      }`}
                    >
                      ${formatCompact(amount)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-white/40 uppercase tracking-wider border-b border-white/5">
                    <th className="px-4 py-3 font-medium">{t('analytics.protocol')}</th>
                    <th className="px-4 py-3 font-medium">{t('analytics.asset')}</th>
                    <th className="px-4 py-3 font-medium text-right">APY</th>
                    <th className="px-4 py-3 font-medium text-right">{t('analytics.security')}</th>
                    <th className="px-4 py-3 font-medium text-right">{t('analytics.daily')}</th>
                    <th className="px-4 py-3 font-medium text-right">{t('analytics.monthly')}</th>
                    <th className="px-4 py-3 font-medium text-right">{t('analytics.yearly')}</th>
                  </tr>
                </thead>
                <tbody>
                  {calculatorResults.map((result, index) => (
                    <tr key={index} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {result.logo ? (
                            <img src={result.logo} alt={result.protocol} className="w-6 h-6 rounded-lg bg-white/10" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                          ) : (
                            <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold text-white/60">
                              {result.protocol.charAt(0)}
                            </div>
                          )}
                          <span className="font-medium text-white">{result.protocol}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-white/60">{result.stablecoin} • {result.chain}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-safe-400 font-medium">{result.apy.toFixed(2)}%</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-medium ${result.securityScore >= 80 ? 'text-green-400' : result.securityScore >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {result.securityScore.toFixed(0)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-white/70">${result.dailyEarnings.toFixed(2)}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-blue-400 font-medium">${result.monthlyEarnings.toFixed(2)}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-green-400 font-bold">${result.yearlyEarnings.toFixed(2)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Row 6: TVL Changes & Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* TVL Changes */}
            <div className="card p-6">
              <SectionHeader icon={TrendingUp} title={t('analytics.tvlMovers')} subtitle={t('analytics.tvlMoversDesc')} color="text-green-400" />
              <div className="space-y-4">
                {/* Gainers */}
                <div>
                  <div className="text-xs text-white/40 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-green-400" /> {t('analytics.topGainers')}
                  </div>
                  <div className="space-y-2">
                    {tvlChanges.gainers.length > 0 ? tvlChanges.gainers.map((pool) => (
                      <div key={pool.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-green-500/5 border border-green-500/10">
                        <div className="flex items-center gap-2">
                          {pool.protocolLogo && <img src={pool.protocolLogo} alt={pool.protocol} className="w-5 h-5 rounded" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
                          <span className="text-sm text-white">{pool.protocol}</span>
                          <span className="text-xs text-white/40">{pool.stablecoin}</span>
                        </div>
                        <span className="text-green-400 font-medium text-sm">+{pool.changePercent.toFixed(2)}%</span>
                      </div>
                    )) : (
                      <div className="text-sm text-white/40 py-2">{t('analytics.noSignificantGainers')}</div>
                    )}
                  </div>
                </div>
                {/* Losers */}
                <div>
                  <div className="text-xs text-white/40 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <TrendingDown className="w-3 h-3 text-red-400" /> {t('analytics.topLosers')}
                  </div>
                  <div className="space-y-2">
                    {tvlChanges.losers.length > 0 ? tvlChanges.losers.map((pool) => (
                      <div key={pool.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-red-500/5 border border-red-500/10">
                        <div className="flex items-center gap-2">
                          {pool.protocolLogo && <img src={pool.protocolLogo} alt={pool.protocol} className="w-5 h-5 rounded" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
                          <span className="text-sm text-white">{pool.protocol}</span>
                          <span className="text-xs text-white/40">{pool.stablecoin}</span>
                        </div>
                        <span className="text-red-400 font-medium text-sm">{pool.changePercent.toFixed(2)}%</span>
                      </div>
                    )) : (
                      <div className="text-sm text-white/40 py-2">{t('analytics.noSignificantLosers')}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* High APY Alerts */}
            <div className="card p-6">
              <SectionHeader icon={AlertTriangle} title={t('analytics.highApyAlerts')} subtitle={t('analytics.highApyAlertsDesc')} color="text-amber-400" />
              {highApyAlerts.length > 0 ? (
                <div className="space-y-3">
                  {highApyAlerts.map((pool) => (
                    <div key={pool.id} className="flex items-center justify-between py-3 px-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
                      <div className="flex items-center gap-3">
                        {pool.protocolLogo ? (
                          <img src={pool.protocolLogo} alt={pool.protocol} className="w-8 h-8 rounded-lg bg-white/10" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm font-bold text-white/60">
                            {pool.protocol.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-white">{pool.protocol}</div>
                          <div className="text-xs text-white/40">{pool.stablecoin} • {pool.chain}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-amber-400 font-bold">{pool.apy.toFixed(2)}%</div>
                        <div className="flex items-center gap-1 text-xs">
                          <Shield className="w-3 h-3" />
                          <span className={pool.securityScore >= 70 ? 'text-green-400' : 'text-red-400'}>{pool.securityScore}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-white/60">
                        {t('analytics.highApyWarning')}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-40 text-white/40">
                  <div className="text-center">
                    <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-400" />
                    <p>{t('analytics.noHighApyAlerts')}</p>
                    <p className="text-xs mt-1">{t('analytics.allYieldsNormal')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Row 7: YPO (Yield Paid Out) Leaderboard */}
          <div className="card mb-6 overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <SectionHeader icon={DollarSign} title={t('analytics.ypoLeaderboard' as TranslationKey)} subtitle={t('analytics.ypoLeaderboardDesc' as TranslationKey)} color="text-emerald-400" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-white/40 uppercase tracking-wider border-b border-white/5">
                    <th className="px-6 py-4 font-medium">#</th>
                    <th className="px-6 py-4 font-medium">{t('analytics.protocol')}</th>
                    <th className="px-6 py-4 font-medium">{t('analytics.asset')}</th>
                    <th className="px-6 py-4 font-medium text-right">{t('analytics.tvl')}</th>
                    <th className="px-6 py-4 font-medium text-right">APY</th>
                    <th className="px-6 py-4 font-medium text-right">{t('analytics.ypo7d' as TranslationKey)}</th>
                    <th className="px-6 py-4 font-medium text-right">{t('analytics.ypo30d' as TranslationKey)}</th>
                    <th className="px-6 py-4 font-medium text-right">{t('analytics.ypo365d' as TranslationKey)}</th>
                  </tr>
                </thead>
                <tbody>
                  {ypoLeaderboard.map((pool, index) => (
                    <tr key={pool.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <span className={`text-sm font-medium ${index < 3 ? 'text-emerald-400' : 'text-white/40'}`}>
                          {index === 0 ? <Trophy className="w-4 h-4 inline text-yellow-400" /> : index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {pool.protocolLogo ? (
                            <img src={pool.protocolLogo} alt={pool.protocol} className="w-8 h-8 rounded-lg bg-white/10" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm font-bold text-white/60">
                              {pool.protocol.charAt(0)}
                            </div>
                          )}
                          <span className="font-medium text-white">{pool.protocol}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {pool.stablecoinLogo && <img src={pool.stablecoinLogo} alt={pool.stablecoin} className="w-5 h-5 rounded-full" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
                          <span className="text-white/60">{pool.stablecoin}</span>
                          <span className="text-white/30">•</span>
                          <span className="text-white/40 text-sm">{pool.chain}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-blue-400 font-medium">{formatTvl(pool.tvl)}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-safe-400 font-medium">{pool.apy.toFixed(2)}%</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-white/70">{formatTvl(pool.ypo7d)}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-emerald-400 font-medium">{formatTvl(pool.ypo30d)}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-yellow-400 font-bold">{formatTvl(pool.ypo365d)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 bg-emerald-500/5 border-t border-emerald-500/20">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-white/60">
                  {t('analytics.ypoNote' as TranslationKey)}
                </p>
              </div>
            </div>
          </div>

          {/* Row 8: Growth Simulation */}
          <div className="card mb-6 p-6">
            <SectionHeader icon={GrowthIcon} title={t('analytics.growthSimulation' as TranslationKey)} subtitle={t('analytics.growthSimulationDesc' as TranslationKey)} color="text-cyan-400" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Simulation Controls */}
              <div className="space-y-4">
                {/* Initial Investment */}
                <div>
                  <label className="block text-sm text-white/50 mb-2">{t('analytics.initialInvestment' as TranslationKey)} (USD)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={simAmount}
                      onChange={(e) => setSimAmount(Math.max(0, Number(e.target.value)))}
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white font-medium focus:outline-none focus:border-cyan-400/50"
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    {[1000, 5000, 10000, 50000, 100000].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setSimAmount(amount)}
                        className={`px-2 py-1 rounded text-xs transition-colors ${
                          simAmount === amount ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-white/5 text-white/50 hover:bg-white/10'
                        }`}
                      >
                        ${formatCompact(amount)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pool Selection */}
                <div>
                  <label className="block text-sm text-white/50 mb-2">{t('analytics.selectPool' as TranslationKey)}</label>
                  <select
                    value={simPoolId}
                    onChange={(e) => setSimPoolId(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400/50"
                  >
                    <option value="" className="bg-dark-900">{t('analytics.selectPool' as TranslationKey)}...</option>
                    {[...pools].sort((a, b) => b.apy - a.apy).slice(0, 30).map(pool => (
                      <option key={pool.id} value={pool.id} className="bg-dark-900">
                        {pool.protocol} - {pool.stablecoin} ({pool.chain}) - {pool.apy.toFixed(2)}% APY
                      </option>
                    ))}
                  </select>
                </div>

                {/* Timeframe */}
                <div>
                  <label className="block text-sm text-white/50 mb-2">{t('analytics.timeframe' as TranslationKey)}</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={simTimeframe}
                      onChange={(e) => setSimTimeframe(Math.max(1, Number(e.target.value)))}
                      className="w-20 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400/50"
                    />
                    <select
                      value={simTimeUnit}
                      onChange={(e) => setSimTimeUnit(e.target.value as 'weeks' | 'months' | 'years')}
                      className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400/50"
                    >
                      <option value="weeks" className="bg-dark-900">{t('analytics.weeks' as TranslationKey)}</option>
                      <option value="months" className="bg-dark-900">{t('analytics.months' as TranslationKey)}</option>
                      <option value="years" className="bg-dark-900">{t('analytics.years' as TranslationKey)}</option>
                    </select>
                  </div>
                </div>

                {/* Compound Frequency */}
                <div>
                  <label className="block text-sm text-white/50 mb-2">{t('analytics.compoundFrequency' as TranslationKey)}</label>
                  <div className="flex gap-2">
                    {(['daily', 'weekly', 'monthly'] as const).map((freq) => (
                      <button
                        key={freq}
                        onClick={() => setSimCompoundFreq(freq)}
                        className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                          simCompoundFreq === freq
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                            : 'bg-white/5 text-white/50 hover:bg-white/10'
                        }`}
                      >
                        {t(`analytics.${freq}` as TranslationKey)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Results */}
              <div>
                {simulationData ? (
                  <div className="space-y-4">
                    {/* Summary Stats */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-center">
                        <div className="text-xs text-white/50 mb-1">{t('analytics.projectedValue' as TranslationKey)}</div>
                        <div className="text-xl font-bold text-cyan-400">{formatTvl(simulationData.finalValue)}</div>
                      </div>
                      <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
                        <div className="text-xs text-white/50 mb-1">{t('analytics.totalEarnings' as TranslationKey)}</div>
                        <div className="text-xl font-bold text-green-400">+{formatTvl(simulationData.totalEarnings)}</div>
                      </div>
                      <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
                        <div className="text-xs text-white/50 mb-1">{t('analytics.effectiveApy' as TranslationKey)}</div>
                        <div className="text-xl font-bold text-purple-400">{simulationData.effectiveApy.toFixed(2)}%</div>
                      </div>
                    </div>

                    {/* Growth Chart */}
                    <div className="p-4 rounded-xl bg-white/5">
                      <div className="text-sm text-white/50 mb-3">{t('analytics.simulationChart' as TranslationKey)}</div>
                      <ResponsiveContainer width="100%" height={180}>
                        <AreaChart data={simulationData.chartData} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                          <defs>
                            <linearGradient id="simGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="label" stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 10 }} />
                          <YAxis stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 10 }} tickFormatter={(v) => `$${formatCompact(v)}`} />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', padding: '12px' }}
                            formatter={(value: number) => [`$${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`, 'Value']}
                          />
                          <Area type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} fill="url(#simGradient)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Selected Pool Info */}
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                      {simulationData.pool.protocolLogo && (
                        <img src={simulationData.pool.protocolLogo} alt={simulationData.pool.protocol} className="w-8 h-8 rounded-lg" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      )}
                      <div className="flex-1">
                        <div className="font-medium text-white">{simulationData.pool.protocol}</div>
                        <div className="text-xs text-white/40">{simulationData.pool.stablecoin} • {simulationData.pool.chain}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-safe-400 font-medium">{simulationData.pool.apy.toFixed(2)}% APY</div>
                        <div className="text-xs text-white/40">Score: {simulationData.pool.securityScore}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-white/40 py-12">
                    <div className="text-center">
                      <Calculator className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>{t('analytics.selectPool' as TranslationKey)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Row 9: Pool Comparison */}
          <div className="card mb-6 p-6">
            <SectionHeader icon={GitCompare} title={t('analytics.historicalComparison' as TranslationKey)} subtitle={t('analytics.historicalComparisonDesc' as TranslationKey)} color="text-orange-400" />

            {/* Pool Selection */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 mb-3">
                {comparisonPools.map((pool) => (
                  <div
                    key={pool.id}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-500/10 border border-orange-500/30"
                  >
                    {pool.protocolLogo && (
                      <img src={pool.protocolLogo} alt={pool.protocol} className="w-5 h-5 rounded" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    )}
                    <span className="text-sm text-white">{pool.protocol}</span>
                    <span className="text-xs text-white/40">{pool.stablecoin}</span>
                    <button
                      onClick={() => setComparisonPoolIds(ids => ids.filter(id => id !== pool.id))}
                      className="ml-1 p-1 rounded hover:bg-white/10 transition-colors"
                    >
                      <X className="w-3 h-3 text-white/50" />
                    </button>
                  </div>
                ))}
              </div>

              {comparisonPoolIds.length < 4 && (
                <div className="flex gap-2">
                  <select
                    onChange={(e) => {
                      if (e.target.value && !comparisonPoolIds.includes(e.target.value)) {
                        setComparisonPoolIds(ids => [...ids, e.target.value]);
                      }
                      e.target.value = '';
                    }}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-400/50"
                  >
                    <option value="" className="bg-dark-900">{t('analytics.addPool' as TranslationKey)}...</option>
                    {pools
                      .filter(p => !comparisonPoolIds.includes(p.id))
                      .sort((a, b) => b.tvl - a.tvl)
                      .slice(0, 50)
                      .map(pool => (
                        <option key={pool.id} value={pool.id} className="bg-dark-900">
                          {pool.protocol} - {pool.stablecoin} ({pool.chain})
                        </option>
                      ))}
                  </select>
                </div>
              )}
            </div>

            {/* Comparison Table */}
            {comparisonPools.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-white/40 uppercase tracking-wider border-b border-white/5">
                      <th className="px-4 py-3 font-medium">{t('analytics.protocol')}</th>
                      <th className="px-4 py-3 font-medium text-right">{t('analytics.currentApy' as TranslationKey)}</th>
                      <th className="px-4 py-3 font-medium text-right">{t('analytics.avgApy7d' as TranslationKey)}</th>
                      <th className="px-4 py-3 font-medium text-right">{t('analytics.tvl')}</th>
                      <th className="px-4 py-3 font-medium text-right">{t('analytics.security')}</th>
                      <th className="px-4 py-3 font-medium text-right">{t('analytics.volatility' as TranslationKey)}</th>
                      <th className="px-4 py-3 font-medium text-right">{t('analytics.trend' as TranslationKey)}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonPools.map((pool, index) => {
                      const isBestApy = pool.apy === Math.max(...comparisonPools.map(p => p.apy));
                      const isBestSecurity = pool.securityScore === Math.max(...comparisonPools.map(p => p.securityScore));
                      return (
                        <tr key={pool.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              {pool.protocolLogo ? (
                                <img src={pool.protocolLogo} alt={pool.protocol} className="w-8 h-8 rounded-lg bg-white/10" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                              ) : (
                                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm font-bold text-white/60">
                                  {pool.protocol.charAt(0)}
                                </div>
                              )}
                              <div>
                                <div className="font-medium text-white">{pool.protocol}</div>
                                <div className="text-xs text-white/40">{pool.stablecoin} • {pool.chain}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <span className={`font-medium ${isBestApy ? 'text-yellow-400' : 'text-safe-400'}`}>
                              {pool.apy.toFixed(2)}%
                              {isBestApy && <Trophy className="w-3 h-3 inline ml-1 text-yellow-400" />}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <span className="text-white/70">{pool.avgApy7d.toFixed(2)}%</span>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <span className="text-blue-400 font-medium">{formatTvl(pool.tvl)}</span>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <span className={`font-medium ${isBestSecurity ? 'text-emerald-400' : pool.securityScore >= 80 ? 'text-green-400' : pool.securityScore >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                              {pool.securityScore}
                              {isBestSecurity && <Shield className="w-3 h-3 inline ml-1 text-emerald-400" />}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <span className={`text-sm ${pool.volatility < 0.5 ? 'text-green-400' : pool.volatility < 1 ? 'text-yellow-400' : 'text-red-400'}`}>
                              {pool.volatility.toFixed(2)}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <span className={`flex items-center justify-end gap-1 ${pool.trend > 0 ? 'text-green-400' : pool.trend < 0 ? 'text-red-400' : 'text-white/40'}`}>
                              {pool.trend > 0 ? <TrendingUp className="w-3 h-3" /> : pool.trend < 0 ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                              {pool.trend > 0 ? '+' : ''}{pool.trend.toFixed(2)}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex items-center justify-center py-12 text-white/40">
                <div className="text-center">
                  <GitCompare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>{t('analytics.noPoolsSelected' as TranslationKey)}</p>
                </div>
              </div>
            )}
          </div>

          {/* Row 10: Yield Range by Protocol */}
          <div className="card mb-6 overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <SectionHeader icon={BarChart3} title={t('analytics.yieldRangeByProtocol')} subtitle={t('analytics.yieldRangeByProtocolDesc')} color="text-indigo-400" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-white/40 uppercase tracking-wider border-b border-white/5">
                    <th className="px-6 py-4 font-medium">#</th>
                    <th className="px-6 py-4 font-medium">{t('analytics.protocol')}</th>
                    <th className="px-6 py-4 font-medium text-right">{t('analytics.minApy')}</th>
                    <th className="px-6 py-4 font-medium text-right">{t('analytics.avgApy')}</th>
                    <th className="px-6 py-4 font-medium text-right">{t('analytics.maxApy')}</th>
                    <th className="px-6 py-4 font-medium">{t('analytics.range')}</th>
                    <th className="px-6 py-4 font-medium text-right">{t('analytics.tvl')}</th>
                    <th className="px-6 py-4 font-medium text-right">{t('analytics.security')}</th>
                  </tr>
                </thead>
                <tbody>
                  {protocolStats.slice(0, 15).map((protocol, index) => {
                    const range = protocol.maxApy - protocol.minApy;
                    const rangePercent = protocol.maxApy > 0 ? ((protocol.avgApy - protocol.minApy) / range) * 100 : 50;
                    return (
                      <tr key={protocol.protocol} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <span className={`text-sm font-medium ${index < 3 ? 'text-yellow-400' : 'text-white/40'}`}>{index + 1}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {protocol.logo ? (
                              <img src={protocol.logo} alt={protocol.protocol} className="w-8 h-8 rounded-lg bg-white/10" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm font-bold text-white/60">
                                {protocol.protocol.charAt(0)}
                              </div>
                            )}
                            <span className="font-medium text-white">{protocol.protocol}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-white/50">{protocol.minApy.toFixed(2)}%</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-safe-400 font-medium">{protocol.avgApy.toFixed(2)}%</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-yellow-400 font-medium">{protocol.maxApy.toFixed(2)}%</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-white/30 via-safe-400 to-yellow-400 rounded-full" style={{ width: `${Math.min(100, rangePercent)}%` }} />
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-green-400 font-medium">{formatTvl(protocol.tvl)}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`font-medium ${protocol.avgSecurityScore >= 80 ? 'text-green-400' : protocol.avgSecurityScore >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {protocol.avgSecurityScore.toFixed(0)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Row 8: Protocol Leaderboard */}
          <div className="card mb-6 overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <SectionHeader icon={Award} title={t('analytics.protocolLeaderboard')} subtitle={t('analytics.protocolLeaderboardDesc')} color="text-yellow-400" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-white/40 uppercase tracking-wider border-b border-white/5">
                    <th className="px-6 py-4 font-medium">#</th>
                    <th className="px-6 py-4 font-medium">{t('analytics.protocol')}</th>
                    <th className="px-6 py-4 font-medium text-right">{t('analytics.tvl')}</th>
                    <th className="px-6 py-4 font-medium text-right">{t('analytics.avgApy')}</th>
                    <th className="px-6 py-4 font-medium text-right">{t('analytics.security')}</th>
                    <th className="px-6 py-4 font-medium text-right">{t('analytics.chains')}</th>
                    <th className="px-6 py-4 font-medium text-right">{t('analytics.pools')}</th>
                  </tr>
                </thead>
                <tbody>
                  {protocolStats.slice(0, 15).map((protocol, index) => (
                    <tr key={protocol.protocol} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <span className={`text-sm font-medium ${index < 3 ? 'text-yellow-400' : 'text-white/40'}`}>{index + 1}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {protocol.logo ? (
                            <img src={protocol.logo} alt={protocol.protocol} className="w-8 h-8 rounded-lg bg-white/10" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm font-bold text-white/60">
                              {protocol.protocol.charAt(0)}
                            </div>
                          )}
                          <span className="font-medium text-white">{protocol.protocol}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-green-400 font-medium">{formatTvl(protocol.tvl)}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-safe-400 font-medium">{protocol.avgApy.toFixed(2)}%</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`font-medium ${protocol.avgSecurityScore >= 80 ? 'text-green-400' : protocol.avgSecurityScore >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {protocol.avgSecurityScore.toFixed(0)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-white/60">{protocol.chainCount}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-white/60">{protocol.poolCount}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Row 9: Top Pools */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Top by APY */}
            <div className="card overflow-hidden">
              <div className="p-6 border-b border-white/5">
                <SectionHeader icon={TrendingUp} title={t('analytics.topByApy')} subtitle={t('analytics.topByApyDesc')} color="text-safe-400" />
              </div>
              <div className="divide-y divide-white/5">
                {topPoolsByApy.map((pool, index) => (
                  <div key={pool.id} className="px-6 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
                    <span className={`text-sm font-medium w-6 ${index < 3 ? 'text-safe-400' : 'text-white/40'}`}>{index + 1}</span>
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {pool.protocolLogo ? (
                        <img src={pool.protocolLogo} alt={pool.protocol} className="w-8 h-8 rounded-lg bg-white/10" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm font-bold text-white/60">{pool.protocol.charAt(0)}</div>
                      )}
                      <div className="min-w-0">
                        <div className="font-medium text-white truncate">{pool.protocol}</div>
                        <div className="flex items-center gap-2 text-xs text-white/40">
                          {pool.stablecoinLogo && <img src={pool.stablecoinLogo} alt={pool.stablecoin} className="w-4 h-4 rounded-full" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
                          <span>{pool.stablecoin}</span>
                          <span className="opacity-50">•</span>
                          {pool.chainLogo && <img src={pool.chainLogo} alt={pool.chain} className="w-4 h-4 rounded-full" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
                          <span>{pool.chain}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-safe-400 font-bold">{pool.apy.toFixed(2)}%</div>
                      <div className="text-xs text-white/40">{formatTvl(pool.tvl)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top by TVL */}
            <div className="card overflow-hidden">
              <div className="p-6 border-b border-white/5">
                <SectionHeader icon={Wallet} title={t('analytics.topByTvl')} subtitle={t('analytics.topByTvlDesc')} color="text-blue-400" />
              </div>
              <div className="divide-y divide-white/5">
                {topPoolsByTvl.map((pool, index) => (
                  <div key={pool.id} className="px-6 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
                    <span className={`text-sm font-medium w-6 ${index < 3 ? 'text-blue-400' : 'text-white/40'}`}>{index + 1}</span>
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {pool.protocolLogo ? (
                        <img src={pool.protocolLogo} alt={pool.protocol} className="w-8 h-8 rounded-lg bg-white/10" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm font-bold text-white/60">{pool.protocol.charAt(0)}</div>
                      )}
                      <div className="min-w-0">
                        <div className="font-medium text-white truncate">{pool.protocol}</div>
                        <div className="flex items-center gap-2 text-xs text-white/40">
                          {pool.stablecoinLogo && <img src={pool.stablecoinLogo} alt={pool.stablecoin} className="w-4 h-4 rounded-full" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
                          <span>{pool.stablecoin}</span>
                          <span className="opacity-50">•</span>
                          {pool.chainLogo && <img src={pool.chainLogo} alt={pool.chain} className="w-4 h-4 rounded-full" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
                          <span>{pool.chain}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-blue-400 font-bold">{formatTvl(pool.tvl)}</div>
                      <div className="text-xs text-white/40">{pool.apy.toFixed(2)}% APY</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 10: Stablecoin Comparison */}
          <div className="card overflow-hidden mb-8">
            <div className="p-6 border-b border-white/5">
              <SectionHeader icon={Layers} title={t('analytics.stablecoinComparison')} subtitle={t('analytics.stablecoinComparisonDesc')} color="text-purple-400" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-white/40 uppercase tracking-wider border-b border-white/5">
                    <th className="px-6 py-4 font-medium">{t('analytics.stablecoin')}</th>
                    <th className="px-6 py-4 font-medium text-right">{t('analytics.totalTvlCol')}</th>
                    <th className="px-6 py-4 font-medium text-right">{t('analytics.avgApyCol')}</th>
                    <th className="px-6 py-4 font-medium text-right">{t('analytics.bestApy')}</th>
                    <th className="px-6 py-4 font-medium text-right">{t('analytics.opportunities')}</th>
                  </tr>
                </thead>
                <tbody>
                  {stablecoinStats.map((stat) => (
                    <tr key={stat.stablecoin} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {stat.logo ? (
                            <img src={stat.logo} alt={stat.stablecoin} className="w-8 h-8 rounded-full" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                          ) : (
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: STABLECOIN_COLORS[stat.stablecoin] || '#6b7280' }}>
                              {stat.stablecoin.charAt(0)}
                            </div>
                          )}
                          <span className="font-medium text-white">{stat.stablecoin}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-green-400 font-medium">{formatTvl(stat.tvl)}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-safe-400 font-medium">{stat.avgApy.toFixed(2)}%</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div>
                          <span className="text-yellow-400 font-medium">{stat.bestApy.toFixed(2)}%</span>
                          <div className="text-xs text-white/40">{stat.bestProtocol}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-white/60">{stat.poolCount}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Data Sources Info Box */}
          <div className="card p-6">
            <SectionHeader icon={Database} title={t('analytics.dataSources')} subtitle={t('analytics.dataSourcesDesc')} color="text-cyan-400" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* DefiLlama Source */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Globe className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium text-white">{t('analytics.defillamaApi')}</div>
                    <div className="text-xs text-white/40">{t('analytics.primaryDataSource')}</div>
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-white/50">{t('analytics.data')}</span>
                    <span className="text-white/70">{t('analytics.apyTvlProtocols')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/50">{t('analytics.update')}</span>
                    <span className="text-green-400">{t('analytics.realtime')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/50">{t('analytics.status')}</span>
                    <span className="flex items-center gap-1 text-green-400">
                      <CheckCircle className="w-3 h-3" /> {t('analytics.live')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Aleph IPFS Storage */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <Server className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="font-medium text-white">{t('analytics.alephIpfs')}</div>
                    <div className="text-xs text-white/40">{t('analytics.historicalStorage')}</div>
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-white/50">{t('analytics.data')}</span>
                    <span className="text-white/70">{t('analytics.apyHistory')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/50">{t('analytics.retention')}</span>
                    <span className="text-white/70">{t('analytics.days90')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/50">{t('analytics.poolsTracked')}</span>
                    <span className="text-purple-400">{collectorStatus.isLoading ? '...' : collectorStatus.totalPools}</span>
                  </div>
                </div>
              </div>

              {/* GitHub Actions Collector */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-gray-500/10">
                    <Github className="w-5 h-5 text-white/70" />
                  </div>
                  <div>
                    <div className="font-medium text-white">{t('analytics.githubActions')}</div>
                    <div className="text-xs text-white/40">{t('analytics.hourlyCollector')}</div>
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-white/50">{t('analytics.frequency')}</span>
                    <span className="text-white/70">{t('analytics.everyHour')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/50">{t('analytics.lastRun')}</span>
                    <span className="text-white/70">
                      {collectorStatus.isLoading ? '...' :
                       collectorStatus.lastCollected ?
                         new Date(collectorStatus.lastCollected).toLocaleString(locale === 'en' ? 'en-US' : locale, {
                           month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                         }) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/50">{t('analytics.status')}</span>
                    {collectorStatus.isLoading ? (
                      <span className="text-white/40">{t('analytics.checking')}</span>
                    ) : collectorStatus.error ? (
                      <span className="flex items-center gap-1 text-red-400">
                        <XCircle className="w-3 h-3" /> {t('analytics.error')}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-green-400">
                        <CheckCircle className="w-3 h-3" /> {t('analytics.active')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Info Note */}
            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <div className="text-blue-400 font-medium mb-1">{t('analytics.aboutData')}</div>
                  <p className="text-white/60">
                    {t('analytics.aboutDataText')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer locale={locale} />
    </div>
  );
}

// ============================================
// MAIN PAGE EXPORT
// ============================================

export default function AnalyticsPage() {
  return (
    <I18nProvider>
      <AnalyticsContent />
    </I18nProvider>
  );
}
