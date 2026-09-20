// ============================================
// 🔌 API ROUTE: /api/v1/stats
// Returns aggregate statistics across all pools
// ============================================

import { NextRequest } from 'next/server';
import { getStats } from '@/lib/api/data-fetcher';
import {
  successResponse,
  errorResponse,
  applyRateLimit,
  addHeaders,
} from '@/lib/api/utils';

export const runtime = 'edge';
export const revalidate = 300; // 5 minutes

/**
 * GET /api/v1/stats
 *
 * Returns aggregate statistics including:
 * - Total TVL across all pools
 * - Average APY
 * - Average security score
 * - Pool, protocol, chain, and stablecoin counts
 * - Breakdown by stablecoin
 * - Breakdown by chain
 */
export async function GET(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = applyRateLimit(request);
  if (!rateLimitResult.allowed) {
    return addHeaders(rateLimitResult.response!, rateLimitResult.headers);
  }

  try {
    const stats = await getStats();

    // Format the response
    const formattedStats = {
      totalTvl: Math.round(stats.totalTvl),
      averageApy: parseFloat(stats.averageApy.toFixed(2)),
      averageSecurityScore: parseFloat(stats.averageSecurityScore.toFixed(1)),
      totalPools: stats.totalPools,
      protocolCount: stats.protocolCount,
      chainCount: stats.chainCount,
      stablecoinCount: stats.stablecoinCount,
      byStablecoin: Object.entries(stats.byStablecoin).reduce(
        (acc, [coin, data]) => {
          acc[coin] = {
            tvl: Math.round(data.tvl),
            avgApy: parseFloat(data.avgApy.toFixed(2)),
            poolCount: data.poolCount,
          };
          return acc;
        },
        {} as Record<string, { tvl: number; avgApy: number; poolCount: number }>
      ),
      byChain: Object.entries(stats.byChain).reduce((acc, [chain, data]) => {
        acc[chain] = {
          tvl: Math.round(data.tvl),
          avgApy: parseFloat(data.avgApy.toFixed(2)),
          poolCount: data.poolCount,
        };
        return acc;
      }, {} as Record<string, { tvl: number; avgApy: number; poolCount: number }>),
    };

    const response = successResponse(formattedStats);
    return addHeaders(response, rateLimitResult.headers);
  } catch (error) {
    console.error('Error in /api/v1/stats:', error);
    return addHeaders(
      errorResponse('Failed to fetch stats', 500),
      rateLimitResult.headers
    );
  }
}

/**
 * OPTIONS handler for CORS preflight
 */
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
