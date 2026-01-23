// ============================================
// 🔌 API ROUTE: /api/v1/protocols
// Returns list of all supported protocols with metadata
// ============================================

import { NextRequest } from 'next/server';
import { fetchAllPools } from '@/lib/api/data-fetcher';
import { YIIELD_PROTOCOLS } from '@/data/yiieldProtocols';
import {
  successResponse,
  errorResponse,
  applyRateLimit,
  addHeaders,
  parseStringParam,
} from '@/lib/api/utils';

export const runtime = 'edge';
export const revalidate = 300; // 5 minutes

/**
 * GET /api/v1/protocols
 *
 * Query parameters:
 * - type: Filter by protocol type (lending, vault)
 *
 * Returns list of all protocols with:
 * - Basic metadata (name, type, launch year)
 * - Security information (audits, exploits)
 * - Current metrics (TVL, pool count)
 * - Supported chains
 */
export async function GET(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = applyRateLimit(request);
  if (!rateLimitResult.allowed) {
    return addHeaders(rateLimitResult.response!, rateLimitResult.headers);
  }

  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const typeFilter = parseStringParam(searchParams, 'type');

    // Get all pools to calculate current metrics
    const pools = await fetchAllPools();

    // Group pools by protocol
    const poolsByProtocol = pools.reduce((acc, pool) => {
      if (!acc[pool.project]) {
        acc[pool.project] = [];
      }
      acc[pool.project].push(pool);
      return acc;
    }, {} as Record<string, typeof pools>);

    // Build protocol list with metadata
    let protocols = Object.entries(YIIELD_PROTOCOLS).map(([slug, protocol]) => {
      const protocolPools = poolsByProtocol[slug] || [];
      const totalTvl = protocolPools.reduce((sum: number, pool: any) => sum + pool.tvlUsd, 0);
      const chains = [...new Set(protocolPools.map((p: any) => p.chain))];

      return {
        slug,
        name: protocol.name,
        teamStatus: protocol.teamStatus,
        auditors: protocol.auditors || [],
        auditCount: protocol.auditors?.length || 0,
        insurance: protocol.insurance,
        governance: protocol.governance,
        tvl: Math.round(totalTvl),
        poolCount: protocolPools.length,
        chains,
      };
    });

    // Sort by TVL descending
    protocols.sort((a, b) => b.tvl - a.tvl);

    const response = successResponse(protocols, {
      total: protocols.length,
      filters: { type: typeFilter },
    });

    return addHeaders(response, rateLimitResult.headers);
  } catch (error) {
    console.error('Error in /api/v1/protocols:', error);
    return addHeaders(
      errorResponse('Failed to fetch protocols', 500),
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
