// ============================================
// 🔌 API ROUTE: /api/v1/protocols/[slug]
// Returns detailed information for a specific protocol
// ============================================

import { NextRequest } from 'next/server';
import { fetchAllPools } from '@/lib/api/data-fetcher';
import { YIIELD_PROTOCOLS } from '@/data/yiieldProtocols';
import {
  successResponse,
  errorResponse,
  applyRateLimit,
  addHeaders,
} from '@/lib/api/utils';

export const runtime = 'edge';
export const revalidate = 300; // 5 minutes

/**
 * GET /api/v1/protocols/[slug]
 *
 * Returns detailed information for a specific protocol including:
 * - Complete metadata
 * - All pools for this protocol
 * - Aggregate statistics
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  // Apply rate limiting
  const rateLimitResult = applyRateLimit(request);
  if (!rateLimitResult.allowed) {
    return addHeaders(rateLimitResult.response!, rateLimitResult.headers);
  }

  try {
    const slug = params.slug;

    // Find protocol metadata
    const protocol = YIIELD_PROTOCOLS[slug];
    if (!protocol) {
      return addHeaders(
        errorResponse('Protocol not found', 404),
        rateLimitResult.headers
      );
    }

    // Get all pools for this protocol
    const allPools = await fetchAllPools();
    const protocolPools = allPools.filter((pool) => pool.project === slug);

    // Calculate aggregate stats
    const totalTvl = protocolPools.reduce((sum, pool) => sum + pool.tvlUsd, 0);
    const avgApy =
      protocolPools.length > 0
        ? protocolPools.reduce((sum, pool) => sum + pool.apy, 0) / protocolPools.length
        : 0;
    const chains = [...new Set(protocolPools.map((p) => p.chain))];
    const stablecoins = [...new Set(protocolPools.map((p) => p.symbol))];

    // Format pools
    const formattedPools = protocolPools.map((pool) => ({
      id: pool.pool,
      chain: pool.chain,
      stablecoin: pool.symbol,
      apy: parseFloat(pool.apy.toFixed(2)),
      tvl: Math.round(pool.tvlUsd),
      securityScore: pool.securityScore || 0,
      yiieldScore: pool.yiieldScore || 0,
      poolUrl: pool.poolMeta || '',
    }));

    const response = successResponse({
      slug,
      name: protocol.name,
      teamStatus: protocol.teamStatus,
      auditors: protocol.auditors || [],
      auditCount: protocol.auditors?.length || 0,
      insurance: protocol.insurance,
      governance: protocol.governance,
      stats: {
        totalTvl: Math.round(totalTvl),
        averageApy: parseFloat(avgApy.toFixed(2)),
        poolCount: protocolPools.length,
        chains,
        stablecoins,
      },
      pools: formattedPools,
    });

    return addHeaders(response, rateLimitResult.headers);
  } catch (error) {
    console.error('Error in /api/v1/protocols/[slug]:', error);
    return addHeaders(
      errorResponse('Failed to fetch protocol', 500),
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
