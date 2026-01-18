'use client';

import { useState, useMemo, memo } from 'react';
import { YieldPool } from '@/types';
import { SecurityBadge } from './SecurityScore';
import { formatNumber, formatPercent, getSecurityRating, getRatingColor } from '@/utils/security';
import { ExternalLink, ChevronDown, ChevronUp, ArrowUpDown, Shield, TrendingUp, Wallet, Info, Loader2 } from 'lucide-react';
import { translations, Locale } from '@/utils/i18n';
import { hasExternalIncentives } from '@/utils/customProtocolsApi';

interface PoolsTableProps {
  pools: YieldPool[];
  isLoading?: boolean;
  locale?: Locale;
}

type SortField = 'apy' | 'tvl' | 'securityScore' | 'protocol';
type SortDirection = 'asc' | 'desc';

const POOLS_PER_PAGE = 20;

// Mini Sparkline component
function Sparkline({ data, color = '#22c55e' }: { data: number[]; color?: string }) {
  if (!data || data.length < 2) return null;
  
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const width = 60;
  const height = 20;
  const padding = 2;
  
  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((value - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');
  
  // Déterminer la tendance (dernière valeur vs première)
  const trend = data[data.length - 1] >= data[0];
  const strokeColor = trend ? '#22c55e' : '#ef4444';
  
  return (
    <svg width={width} height={height} className="opacity-70">
      <polyline
        points={points}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Génère des données de sparkline simulées basées sur l'APY actuel
function generateSparklineData(apy: number): number[] {
  const data: number[] = [];
  const volatility = 0.15;
  let current = apy * (1 - volatility / 2 + Math.random() * volatility);
  
  for (let i = 0; i < 7; i++) {
    data.push(current);
    current = current * (1 + (Math.random() - 0.5) * volatility);
  }
  // Assurer que la dernière valeur est l'APY actuel
  data[data.length - 1] = apy;
  return data;
}

export function PoolsTable({ pools, isLoading, locale = 'en' }: PoolsTableProps) {
  const t = translations[locale];
  const [sortField, setSortField] = useState<SortField>('apy');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(POOLS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const sortedPools = useMemo(() => {
    return [...pools].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'apy': comparison = a.apy - b.apy; break;
        case 'tvl': comparison = a.tvl - b.tvl; break;
        case 'securityScore': comparison = a.securityScore - b.securityScore; break;
        case 'protocol': comparison = a.protocol.localeCompare(b.protocol); break;
      }
      return sortDirection === 'desc' ? -comparison : comparison;
    });
  }, [pools, sortField, sortDirection]);

  const displayedPools = sortedPools.slice(0, displayCount);
  const hasMore = displayCount < sortedPools.length;
  const remainingCount = sortedPools.length - displayCount;

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    // Simuler un petit délai pour le feedback utilisateur
    setTimeout(() => {
      setDisplayCount(prev => Math.min(prev + POOLS_PER_PAGE, sortedPools.length));
      setIsLoadingMore(false);
    }, 300);
  };

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    // Reset display count when sorting changes
    setDisplayCount(POOLS_PER_PAGE);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (field !== sortField) return <ArrowUpDown className="w-4 h-4 opacity-30" />;
    return sortDirection === 'desc' ? <ChevronDown className="w-4 h-4 text-safe-400" /> : <ChevronUp className="w-4 h-4 text-safe-400" />;
  };

  if (isLoading) return <PoolsTableSkeleton />;

  if (pools.length === 0) {
    return (
      <div className="card p-12 text-center">
        <div className="text-white/40 text-lg">{t['table.noPool']}</div>
        <div className="text-white/30 text-sm mt-2">{t['table.tryFilters']}</div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <h3 className="font-semibold text-white">{t['table.allPools']} ({pools.length})</h3>
        <span className="text-sm text-white/40">
          {displayCount} / {pools.length} {t['table.displayed']}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5 text-left text-xs text-white/40 uppercase tracking-wider">
              <th className="px-4 py-3 font-medium">
                <button onClick={() => handleSort('protocol')} className="flex items-center gap-1 hover:text-white transition-colors">{t['table.protocol']}<SortIcon field="protocol" /></button>
              </th>
              <th className="px-4 py-3 font-medium">{t['table.asset']}</th>
              <th className="px-4 py-3 font-medium">{t['table.network']}</th>
              <th className="px-4 py-3 font-medium">
                <button onClick={() => handleSort('apy')} className="flex items-center gap-1 hover:text-white transition-colors"><TrendingUp className="w-3 h-3" />APY<SortIcon field="apy" /></button>
              </th>
              <th className="px-4 py-3 font-medium text-center">7j</th>
              <th className="px-4 py-3 font-medium">
                <button onClick={() => handleSort('tvl')} className="flex items-center gap-1 hover:text-white transition-colors"><Wallet className="w-3 h-3" />TVL<SortIcon field="tvl" /></button>
              </th>
              <th className="px-4 py-3 font-medium">
                <button onClick={() => handleSort('securityScore')} className="flex items-center gap-1 hover:text-white transition-colors"><Shield className="w-3 h-3" />{t['table.security']}<SortIcon field="securityScore" /></button>
              </th>
              <th className="px-4 py-3 font-medium text-right">{t['table.action']}</th>
            </tr>
          </thead>
          <tbody>
            {displayedPools.map((pool) => (
              <PoolRow 
                key={pool.id} 
                pool={pool} 
                isExpanded={expandedRow === pool.id} 
                onToggleExpand={() => setExpandedRow(expandedRow === pool.id ? null : pool.id)} 
                locale={locale} 
              />
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Load More Button */}
      {hasMore && (
        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t['table.loading']}
              </>
            ) : (
              <>
                {t['table.loadMore']}
                <span className="text-white/50 text-sm">({remainingCount} {t['table.remaining']})</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

interface PoolRowProps {
  pool: YieldPool;
  isExpanded: boolean;
  onToggleExpand: () => void;
  locale: Locale;
}

const PoolRow = memo(function PoolRow({ pool, isExpanded, onToggleExpand, locale }: PoolRowProps) {
  const t = translations[locale];
  const securityColor = getRatingColor(getSecurityRating(pool.securityScore));
  const exploitCount = pool.exploits || 0;
  const years = Math.floor(pool.protocolAge / 365);

  // Vérifier si ce pool a des incentives externes
  const externalIncentive = hasExternalIncentives(pool.protocol, pool.stablecoin);

  // Générer les données de sparkline (en production, utiliser pool.apyHistory)
  const sparklineData = useMemo(() => {
    if (pool.apyHistory && pool.apyHistory.length > 1) {
      return pool.apyHistory.map(p => p.apy);
    }
    return generateSparklineData(pool.apy);
  }, [pool.apy, pool.apyHistory]);

  return (
    <>
      <tr className="table-row group">
        <td className="px-4 py-4">
          <div className="flex items-center gap-3">
            {pool.protocolLogo ? (
              <img src={pool.protocolLogo} alt={pool.protocol} className="w-8 h-8 rounded-lg bg-white/10" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden'); }} />
            ) : null}
            <div className={`w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm font-bold ${pool.protocolLogo ? 'hidden' : ''}`}>{pool.protocol.charAt(0)}</div>
            <div>
              <div className="font-medium text-white flex items-center gap-2">
                {pool.protocol}
                {pool.protocolType && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider ${pool.protocolType === 'lending' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                    {pool.protocolType === 'lending' ? 'Lending' : 'Vault'}
                  </span>
                )}
              </div>
              <button onClick={onToggleExpand} className="text-xs text-white/40 hover:text-safe-400 flex items-center gap-1 transition-colors">
                <Info className="w-3 h-3" />{isExpanded ? t['table.lessInfo'] : t['table.moreInfo']}
              </button>
            </div>
          </div>
        </td>
        <td className="px-4 py-4">
          <div className="flex items-center gap-2">
            {pool.stablecoinLogo ? <img src={pool.stablecoinLogo} alt={pool.stablecoin} className="w-6 h-6 rounded-full" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} /> : null}
            <span className="text-white font-medium">{pool.stablecoin}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${pool.currency === 'EUR' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>{pool.currency}</span>
          </div>
        </td>
        <td className="px-4 py-4">
          <div className="flex items-center gap-2">
            {pool.chainLogo && <img src={pool.chainLogo} alt={pool.chain} className="w-5 h-5 rounded-full" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
            <span className="text-white/70">{pool.chain}</span>
          </div>
        </td>
        <td className="px-4 py-4">
          <div className="text-lg font-bold text-safe-400">{formatPercent(pool.apy)}</div>
          {pool.apyReward > 0 && <div className="text-xs text-white/40">Base {formatPercent(pool.apyBase)} + {formatPercent(pool.apyReward)}</div>}
        </td>
        <td className="px-4 py-4">
          <Sparkline data={sparklineData} />
        </td>
        <td className="px-4 py-4"><div className="text-sm font-medium text-white">{formatNumber(pool.tvl)}</div></td>
        <td className="px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: securityColor }} />
            <SecurityBadge score={pool.securityScore} />
            {exploitCount >= 2 && <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-medium">⚠ {exploitCount} exploits</span>}
            {exploitCount === 1 && <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 font-medium">1 exploit</span>}
          </div>
        </td>
        <td className="px-4 py-4 text-right">
          <a href={pool.poolUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-safe-500/10 text-safe-400 text-sm font-medium hover:bg-safe-500/20 transition-colors">
            {t['table.deposit']}<ExternalLink className="w-3 h-3" />
          </a>
        </td>
      </tr>
      {isExpanded && (
        <tr className="bg-white/[0.02]">
          <td colSpan={8} className="px-4 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-white/40 mb-1">Audits</div>
                <div className="text-white font-medium">{pool.audits} audit{pool.audits > 1 ? 's' : ''}</div>
              </div>
              <div>
                <div className="text-white/40 mb-1">{t['table.age']}</div>
                <div className="text-white font-medium">{years > 0 ? `${years} ${t['top.years']}` : `${pool.protocolAge} ${t['top.days']}`}</div>
              </div>
              <div>
                <div className="text-white/40 mb-1">{t['table.exploitHistory']}</div>
                <div className={`font-medium ${exploitCount === 0 ? 'text-safe-400' : exploitCount >= 2 ? 'text-red-400' : 'text-yellow-400'}`}>
                  {exploitCount === 0 ? `✓ ${t['table.noExploit']}` : `⚠ ${exploitCount} ${exploitCount > 1 ? t['top.exploits'] : t['top.exploit']}`}
                </div>
              </div>
              <div>
                <div className="text-white/40 mb-1">{t['table.type']}</div>
                <div className="text-white font-medium capitalize">{pool.protocolType === 'lending' ? t['table.lendingProtocol'] : t['table.vaultManager']}</div>
              </div>
            </div>

            {/* Note spéciale pour Kamino */}
            {pool.protocol === 'Kamino' && (
              <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <div className="text-blue-400 font-medium mb-1">
                      {locale === 'fr' ? 'Vaults curés disponibles' : 'Curated Vaults Available'}
                    </div>
                    <div className="text-white/60 text-xs">
                      {locale === 'fr'
                        ? 'Les APYs affichés sont ceux du marché de base. Des vaults gérés par des experts (Steakhouse, Allez Labs, Sentora) offrent généralement des rendements plus élevés.'
                        : 'Displayed APYs are for base lending markets. Expert-managed vaults (Steakhouse, Allez Labs, Sentora) typically offer higher yields.'}
                      {' '}
                      <a
                        href="https://kamino.com/lend"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline inline-flex items-center gap-1"
                      >
                        {locale === 'fr' ? 'Voir les vaults' : 'View vaults'}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Note pour les incentives externes (Merkl, etc.) */}
            {externalIncentive && (
              <div className="mt-4 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <div className="text-purple-400 font-medium mb-1">
                      {locale === 'fr' ? 'Incentives supplémentaires disponibles' : 'Additional Incentives Available'}
                    </div>
                    <div className="text-white/60 text-xs">
                      {locale === 'fr' ? externalIncentive.note.fr : externalIncentive.note.en}
                      {' '}
                      <a
                        href={externalIncentive.incentivePlatformUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 underline inline-flex items-center gap-1"
                      >
                        {locale === 'fr' ? `Voir sur ${externalIncentive.incentivePlatform}` : `View on ${externalIncentive.incentivePlatform}`}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </td>
        </tr>
      )}
    </>
  );
});
PoolRow.displayName = 'PoolRow';

function PoolsTableSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="p-4 border-b border-white/5"><div className="h-6 w-32 bg-white/10 rounded animate-pulse" /></div>
      <div className="divide-y divide-white/5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="px-4 py-4 flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-white/10 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
              <div className="h-3 w-16 bg-white/5 rounded animate-pulse" />
            </div>
            <div className="h-6 w-16 bg-white/10 rounded animate-pulse" />
            <div className="h-6 w-20 bg-white/10 rounded animate-pulse" />
            <div className="h-6 w-12 bg-white/10 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
