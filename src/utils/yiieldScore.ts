import { YieldPool } from '@/types';
import { calculateYiieldScore, YiieldScoreBreakdown } from '@/types/yiieldScore';
import { getProtocolInfo, YIIELD_PROTOCOLS } from '@/data/yiieldProtocols';

/**
 * Enriches a pool with Yiield Score calculation
 * Takes the base security score and adds bonuses based on protocol info
 */
export function enrichPoolWithYiieldScore(pool: YieldPool): YieldPool {
  const protocolInfo = getProtocolInfo(pool.protocol);

  if (!protocolInfo) {
    // If no protocol info available, Yiield Score equals base security score
    return {
      ...pool,
      yiieldScore: pool.securityScore,
    };
  }

  const scoreBreakdown = calculateYiieldScore(pool.securityScore, protocolInfo);

  return {
    ...pool,
    yiieldScore: scoreBreakdown.total,
  };
}

/**
 * Enriches multiple pools with Yiield Scores
 */
export function enrichPoolsWithYiieldScore(pools: YieldPool[]): YieldPool[] {
  return pools.map(enrichPoolWithYiieldScore);
}

/**
 * Gets detailed score breakdown for a pool
 */
export function getPoolScoreBreakdown(pool: YieldPool): YiieldScoreBreakdown {
  const protocolInfo = getProtocolInfo(pool.protocol);
  return calculateYiieldScore(pool.securityScore, protocolInfo);
}

/**
 * Checks if a protocol has enhanced Yiield Score data
 */
export function hasYiieldScoreData(protocolName: string): boolean {
  return getProtocolInfo(protocolName) !== undefined;
}

/**
 * Gets all protocols with Yiield Score data
 */
export function getProtocolsWithYiieldScore(): string[] {
  return Object.keys(YIIELD_PROTOCOLS);
}
