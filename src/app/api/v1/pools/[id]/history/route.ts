// ============================================
// 🔌 API ROUTE: /api/v1/pools/[id]/history
// Returns historical APY data for a specific pool
// ============================================

import { NextRequest } from 'next/server';
import { getPoolById, fetchPoolHistory } from '@/lib/api/data-fetcher';
import {
  successResponse,
  errorResponse,
  applyRateLimit,
  addHeaders,
  parseStringParam,
} from '@/lib/api/utils';

export const runtime = 'edge';
export const revalidate = 600; // 10 minutes (history doesn't change as often)

/**
 * GET /api/v1/pools/[id]/history
 *
 * Query parameters:
 * - period: Time period (24h, 7d, 30d, 90d) - default: 7d
 *
 * Returns hourly APY snapshots for the specified period
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Apply rate limiting
  const rateLimitResult = applyRateLimit(request);
  if (!rateLimitResult.allowed) {
    return addHeaders(rateLimitResult.response!, rateLimitResult.headers);
  }

  try {
    const poolId = params.id;

    // Get pool info
    const pool = await getPoolById(poolId);
    if (!pool) {
      return addHeaders(
        errorResponse('Pool not found', 404),
        rateLimitResult.headers
      );
    }

    // Generate history ID from pool data
    const historyId = generateHistoryId(pool.project, pool.symbol, pool.chain);

    // Fetch history data from Aleph/IPFS
    const historyData = await fetchPoolHistory(historyId);

    if (!historyData || !historyData.hourly || historyData.hourly.length === 0) {
      return addHeaders(
        errorResponse('No history data available for this pool', 404),
        rateLimitResult.headers
      );
    }

    // Parse period parameter
    const { searchParams } = new URL(request.url);
    const period = parseStringParam(searchParams, 'period', '7d');

    // Filter data by period
    const filteredData = filterByPeriod(historyData.hourly, period);

    const response = successResponse({
      poolId: pool.pool,
      historyId,
      protocol: pool.project,
      chain: pool.chain,
      stablecoin: pool.symbol,
      period,
      dataPoints: filteredData.length,
      hourly: filteredData.map((d) => ({
        timestamp: d.t,
        apy: parseFloat(d.apy.toFixed(2)),
        tvl: Math.round(d.tvl),
      })),
    });

    return addHeaders(response, rateLimitResult.headers);
  } catch (error) {
    console.error('Error in /api/v1/pools/[id]/history:', error);
    return addHeaders(
      errorResponse('Failed to fetch pool history', 500),
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

/**
 * Generate history ID matching collector format
 */
function generateHistoryId(project: string, stablecoin: string, chain: string): string {
  const chainSlug = chain.toLowerCase().replace(/\s+/g, '-');
  return `${project}-${stablecoin.toLowerCase()}-${chainSlug}`;
}

/**
 * Filter history data by time period
 */
function filterByPeriod(
  data: Array<{ t: string; apy: number; tvl: number }>,
  period: string
): Array<{ t: string; apy: number; tvl: number }> {
  const now = new Date();
  let cutoffDate: Date;

  switch (period) {
    case '24h':
      cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case '7d':
      cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    default:
      // Default to 7d
      cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }

  return data.filter((point) => {
    const pointDate = new Date(point.t);
    return pointDate >= cutoffDate;
  });
}
