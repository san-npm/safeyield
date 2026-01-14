'use client';

import { useState, useMemo } from 'react';
import { YieldPool } from '@/types';
import { SecurityBadge } from './SecurityScore';
import { formatNumber, formatPercent, getSecurityRating, getRatingColor } from '@/utils/security';
import { ExternalLink, ChevronDown, ChevronUp, ArrowUpDown, Shield, TrendingUp, Wallet, Info } from 'lucide-react';
import { translations, Locale } from '@/app/page';

interface PoolsTableProps {
  pools: YieldPool[];
  isLoading?: boolean;
  locale?: Locale;
}

type SortField = 'apy' | 'tvl' | 'securityScore' | 'protocol';
type SortDirection = 'asc' | 'desc';

export function PoolsTable({ pools, isLoading, locale = 'en' }: PoolsTableProps) {
  const t = translations[locale];
  const [sortField, setSortField] = useState<SortField>('apy');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

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

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
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
      <div className="p-4 border-b border-white/5">
        <h3 className="font-semibold text-white">{t['table.allPools']} ({pools.length})</h3>
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
            {sortedPools.map((pool) => (
              <PoolRow key={pool.id} pool={pool} isExpanded={expandedRow === pool.id} onToggleExpand={() => setExpandedRow(expandedRow === pool.id ? null : pool.id)} locale={locale} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface PoolRowProps {
  pool: YieldPool;
  isExpanded: boolean;
  onToggleExpand: () => void;
  locale: Locale;
}

function PoolRow({ pool, isExpanded, onToggleExpand, locale }: PoolRowProps) {
  const t = translations[locale];
  const securityColor = getRatingColor(getSecurityRating(pool.securityScore));
  const exploitCount = pool.exploits || 0;
  const years = Math.floor(pool.protocolAge / 365);

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
          <td colSpan={7} className="px-4 py-4">
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
          </td>
        </tr>
      )}
    </>
  );
}

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
