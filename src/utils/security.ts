import { Pool, PoolWithSecurity } from '@/types';

export function calculateSecurityScore(pool: Pool): number {
  let score = 0;

  // TVL Score (0-40 points) - Higher TVL = More security
  if (pool.tvlUsd >= 100000000) score += 40;
  else if (pool.tvlUsd >= 50000000) score += 35;
  else if (pool.tvlUsd >= 10000000) score += 30;
  else if (pool.tvlUsd >= 5000000) score += 25;
  else if (pool.tvlUsd >= 1000000) score += 20;
  else if (pool.tvlUsd >= 500000) score += 15;
  else score += 10;

  // APY Stability (0-30 points) - Lower volatility = More secure
  const apy = pool.apy;
  const apy7d = pool.apyBase7d;
  const apy30d = pool.apyMean30d;

  if (apy30d && apy7d) {
    const volatility = Math.abs(apy - apy30d) / apy30d;
    if (volatility < 0.05) score += 30;
    else if (volatility < 0.1) score += 25;
    else if (volatility < 0.2) score += 20;
    else if (volatility < 0.3) score += 15;
    else score += 10;
  } else {
    score += 15;
  }

  // Protocol Trust (0-30 points) - Well-known protocols
  const trustedProtocols = [
    'aave',
    'compound',
    'curve',
    'maker',
    'uniswap',
    'yearn',
    'benqi',
  ];
  const projectLower = pool.project.toLowerCase();
  if (trustedProtocols.some((p) => projectLower.includes(p))) {
    score += 30;
  } else {
    score += 15;
  }

  return Math.min(100, Math.max(0, score));
}

export function getSecurityLevel(
  score: number
): 'excellent' | 'good' | 'moderate' | 'risky' | 'danger' {
  if (score >= 80) return 'excellent';
  if (score >= 65) return 'good';
  if (score >= 50) return 'moderate';
  if (score >= 35) return 'risky';
  return 'danger';
}

export function addSecurityScore(pool: Pool): PoolWithSecurity {
  const securityScore = calculateSecurityScore(pool);
  const securityLevel = getSecurityLevel(securityScore);

  return {
    ...pool,
    securityScore,
    securityLevel,
  };
}

export function getSecurityColor(level: string): string {
  switch (level) {
    case 'excellent':
      return 'text-green-500';
    case 'good':
      return 'text-lime-500';
    case 'moderate':
      return 'text-yellow-500';
    case 'risky':
      return 'text-orange-500';
    case 'danger':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
}

export function getSecurityBgColor(level: string): string {
  switch (level) {
    case 'excellent':
      return 'bg-green-500/10';
    case 'good':
      return 'bg-lime-500/10';
    case 'moderate':
      return 'bg-yellow-500/10';
    case 'risky':
      return 'bg-orange-500/10';
    case 'danger':
      return 'bg-red-500/10';
    default:
      return 'bg-gray-500/10';
  }
}
