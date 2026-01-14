'use client';

import { useTranslations } from 'next-intl';
import { PoolWithSecurity } from '@/types';
import { getSecurityColor, getSecurityBgColor } from '@/utils/security';
import { TrendingUp } from 'lucide-react';
import Image from 'next/image';

interface PoolsTableProps {
  pools: PoolWithSecurity[];
}

export default function PoolsTable({ pools }: PoolsTableProps) {
  const t = useTranslations('table');

  const formatTVL = (tvl: number) => {
    if (tvl >= 1e9) return `$${(tvl / 1e9).toFixed(2)}B`;
    if (tvl >= 1e6) return `$${(tvl / 1e6).toFixed(2)}M`;
    if (tvl >= 1e3) return `$${(tvl / 1e3).toFixed(2)}K`;
    return `$${tvl.toFixed(2)}`;
  };

  const formatAPY = (apy: number) => {
    return `${apy.toFixed(2)}%`;
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-full inline-block align-middle">
        <div className="overflow-hidden border border-gray-200 dark:border-gray-800 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  {t('protocol')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  {t('chain')}
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  {t('apy')}
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  {t('tvl')}
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  {t('security')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-950 divide-y divide-gray-200 dark:divide-gray-800">
              {pools.map((pool, idx) => (
                <tr
                  key={pool.pool}
                  className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-8 h-8 relative">
                        {/* Protocol logo would go here */}
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm">
                          {pool.project[0].toUpperCase()}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          {pool.project}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {pool.symbol}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                      {pool.chain}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1">
                      <TrendingUp size={14} className="text-green-500" />
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">
                        {formatAPY(pool.apy)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {formatTVL(pool.tvlUsd)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getSecurityBgColor(
                          pool.securityLevel
                        )} ${getSecurityColor(pool.securityLevel)}`}
                      >
                        {pool.securityScore}/100
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
