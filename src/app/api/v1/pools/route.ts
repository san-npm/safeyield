// ============================================
// 🔌 API ROUTE: /api/v1/pools
// Returns all yield pools with filtering and sorting
// ============================================

import { NextRequest } from 'next/server';
import { fetchAllPools } from '@/lib/api/data-fetcher';
import {
  successResponse,
  errorResponse,
  applyRateLimit,
  addHeaders,
  parseNumberParam,
  parseStringParam,
  parseArrayParam,
} from '@/lib/api/utils';
import { YieldPool } from '@/types';

export const runtime = 'edge'; // Use edge runtime for better performance
export const revalidate = 300; // Revalidate every 5 minutes

/**
 * GET /api/v1/pools
 *
 * Query parameters:
 * - stablecoin: Filter by stablecoin (USDC, USDT, etc.)
 * - chain: Filter by blockchain
 * - protocol: Filter by protocol name
 * - protocolType: Filter by lending or vault
 * - minApy: Minimum APY threshold
 * - minTvl: Minimum TVL threshold
 * - minSecurityScore: Minimum security score
 * - sort: Sort field (apy, tvl, securityScore, yiieldScore)
 * - order: Sort order (asc, desc) - default: desc
 * - limit: Number of results (default: 100, max: 500)
 * - offset: Skip N results for pagination
 */
export async function GET(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = applyRateLimit(request);
  if (!rateLimitResult.allowed) {
    return addHeaders(rateLimitResult.response!, rateLimitResult.headers);
  }

  try {
    // Fetch all pools
    const allPools = await fetchAllPools();

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const stablecoin = parseStringParam(searchParams, 'stablecoin');
    const chain = parseStringParam(searchParams, 'chain');
    const protocol = parseStringParam(searchParams, 'protocol');
    const protocolType = parseStringParam(searchParams, 'protocolType');
    const minApy = parseNumberParam(searchParams, 'minApy', 0);
    const minTvl = parseNumberParam(searchParams, 'minTvl', 0);
    const minSecurityScore = parseNumberParam(searchParams, 'minSecurityScore', 0);
    const sortField = parseStringParam(searchParams, 'sort', 'apy');
    const sortOrder = parseStringParam(searchParams, 'order', 'desc');
    const limit = Math.min(parseNumberParam(searchParams, 'limit', 100), 500);
    const offset = parseNumberParam(searchParams, 'offset', 0);

    // Apply filters
    let filteredPools = allPools;

    if (stablecoin) {
      const stablecoins = stablecoin.split(',').map(s => s.trim().toUpperCase());
      filteredPools = filteredPools.filter(pool =>
        stablecoins.includes(pool.symbol?.toUpperCase())
      );
    }

    if (chain) {
      const chains = chain.split(',').map(c => c.trim());
      filteredPools = filteredPools.filter(pool =>
        chains.some(c => pool.chain?.toLowerCase().includes(c.toLowerCase()))
      );
    }

    if (protocol) {
      const protocols = protocol.split(',').map(p => p.trim());
      filteredPools = filteredPools.filter(pool =>
        protocols.some(p => pool.project?.toLowerCase().includes(p.toLowerCase()))
      );
    }

    if (protocolType) {
      filteredPools = filteredPools.filter(pool =>
        pool.projectType?.toLowerCase() === protocolType.toLowerCase()
      );
    }

    if (minApy > 0) {
      filteredPools = filteredPools.filter(pool => pool.apy >= minApy);
    }

    if (minTvl > 0) {
      filteredPools = filteredPools.filter(pool => pool.tvlUsd >= minTvl);
    }

    if (minSecurityScore > 0) {
      filteredPools = filteredPools.filter(pool =>
        pool.securityScore >= minSecurityScore
      );
    }

    // Apply sorting
    const sortableFields = ['apy', 'tvl', 'securityScore', 'yiieldScore'];
    if (sortField && sortableFields.includes(sortField)) {
      filteredPools.sort((a, b) => {
        let aVal: number, bVal: number;

        switch (sortField) {
          case 'apy':
            aVal = a.apy;
            bVal = b.apy;
            break;
          case 'tvl':
            aVal = a.tvlUsd;
            bVal = b.tvlUsd;
            break;
          case 'securityScore':
            aVal = a.securityScore || 0;
            bVal = b.securityScore || 0;
            break;
          case 'yiieldScore':
            aVal = a.yiieldScore || 0;
            bVal = b.yiieldScore || 0;
            break;
          default:
            return 0;
        }

        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      });
    }

    // Apply pagination
    const total = filteredPools.length;
    const paginatedPools = filteredPools.slice(offset, offset + limit);

    // Format response
    const formattedPools = paginatedPools.map(formatPoolResponse);

    const response = successResponse(formattedPools, {
      total,
      limit,
      offset,
      returned: formattedPools.length,
      filters: {
        stablecoin,
        chain,
        protocol,
        protocolType,
        minApy,
        minTvl,
        minSecurityScore,
      },
    });

    return addHeaders(response, rateLimitResult.headers);
  } catch (error) {
    console.error('Error in /api/v1/pools:', error);
    return addHeaders(
      errorResponse('Failed to fetch pools', 500),
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
 * Format pool for API response
 */
function formatPoolResponse(pool: any) {
  return {
    id: pool.pool,
    protocol: pool.project,
    protocolType: pool.projectType || 'unknown',
    chain: pool.chain,
    stablecoin: pool.symbol,
    apy: parseFloat(pool.apy.toFixed(2)),
    apyBase: parseFloat((pool.apyBase || 0).toFixed(2)),
    apyReward: parseFloat((pool.apyReward || 0).toFixed(2)),
    tvl: Math.round(pool.tvlUsd),
    tvlChange24h: 0,
    securityScore: pool.securityScore || 0,
    yiieldScore: pool.yiieldScore || 0,
    poolUrl: pool.poolMeta || '',
    lastUpdated: new Date().toISOString(),
  };
}
