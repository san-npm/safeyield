// ============================================
// 🔌 API ROUTE: /api/v1/pools/[id]
// Returns detailed information for a specific pool
// ============================================

import { NextRequest } from 'next/server';
import { getPoolById } from '@/lib/api/data-fetcher';
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
 * GET /api/v1/pools/[id]
 *
 * Returns detailed information for a specific pool including:
 * - Basic pool data (APY, TVL, etc.)
 * - Security and Yiield scores with breakdown
 * - Protocol information (audits, team, insurance)
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
    const pool = await getPoolById(poolId);

    if (!pool) {
      return addHeaders(
        errorResponse('Pool not found', 404),
        rateLimitResult.headers
      );
    }

    // Get protocol metadata
    const protocol = YIIELD_PROTOCOLS[pool.project];

    // Calculate score breakdown
    const scoreBreakdown = calculateScoreBreakdown(pool, protocol);

    const response = successResponse({
      id: pool.pool,
      protocol: pool.project,
      protocolType: pool.projectType || 'unknown',
      chain: pool.chain,
      stablecoin: pool.symbol,
      apy: parseFloat(pool.apy.toFixed(2)),
      apyBase: parseFloat((pool.apyBase || 0).toFixed(2)),
      apyReward: parseFloat((pool.apyReward || 0).toFixed(2)),
      tvl: Math.round(pool.tvlUsd),
      securityScore: pool.securityScore || 0,
      yiieldScore: pool.yiieldScore || 0,
      scoreBreakdown,
      protocolInfo: protocol
        ? {
            name: protocol.name,
            teamStatus: protocol.teamStatus,
            auditors: protocol.auditors || [],
            insurance: protocol.insurance,
            governance: protocol.governance,
          }
        : null,
      poolUrl: pool.poolMeta || '',
    });

    return addHeaders(response, rateLimitResult.headers);
  } catch (error) {
    console.error('Error in /api/v1/pools/[id]:', error);
    return addHeaders(
      errorResponse('Failed to fetch pool', 500),
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
 * Calculate detailed score breakdown
 */
function calculateScoreBreakdown(pool: any, protocol: any) {
  const breakdown: any = {
    audit: 0,
    protocolAge: 0,
    tvl: 0,
    exploits: 0,
  };

  if (!protocol) {
    return {
      baseScore: pool.securityScore || 0,
      breakdown,
      bonuses: {},
      totalBonus: 0,
      yiieldScore: pool.yiieldScore || 0,
      rawTotal: pool.securityScore || 0,
    };
  }

  // Use the already calculated security score
  const baseScore = pool.securityScore || 0;

  // Calculate bonuses for Yiield Score
  const bonuses: any = {};

  // Tier-1 auditor bonus (+10 points)
  const tier1Auditors = [
    'OpenZeppelin',
    'Trail of Bits',
    'Consensys Diligence',
    'ChainSecurity',
    'Certora',
  ];
  const hasTier1Audit = protocol.auditors?.some((audit: any) =>
    tier1Auditors.some((auditor) => audit.name.includes(auditor))
  );
  if (hasTier1Audit) bonuses.tier1Auditor = 10;

  // Doxxed team bonus (+5 points)
  if (protocol.teamStatus === 'doxxed') bonuses.doxxedTeam = 5;

  // Insurance bonus (+3 points)
  if (protocol.insurance) bonuses.insurance = 3;

  // DAO governance bonus (+2 points)
  if (protocol.governance?.governanceType === 'dao') bonuses.governance = 2;

  const totalBonus = Object.values(bonuses).reduce(
    (sum: number, val: any) => sum + val,
    0
  );

  return {
    baseScore,
    breakdown,
    bonuses,
    totalBonus,
    yiieldScore: pool.yiieldScore || baseScore,
    rawTotal: baseScore + totalBonus,
  };
}
