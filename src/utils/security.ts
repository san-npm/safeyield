import { SecurityFactors, SecurityRating, YieldPool, ProtocolInfo } from '@/types';

/**
 * Calcule le score de sécurité d'un pool (0-100)
 * Basé sur 4 facteurs:
 * - Nombre d'audits (0-25 points)
 * - Ancienneté du protocole (0-25 points)
 * - TVL / Liquidité (0-25 points)
 * - Historique d'exploits (0-25 points)
 */
export function calculateSecurityScore(
  audits: number,
  protocolAgeDays: number,
  tvl: number,
  exploitsCount: number
): SecurityFactors {
  // Score audits: 0 audit = 0, 1 = 10, 2 = 18, 3+ = 25
  const auditScore = Math.min(25, audits === 0 ? 0 : audits === 1 ? 10 : audits === 2 ? 18 : 25);
  
  // Score ancienneté: < 30 jours = 0, 30-90 = 10, 90-365 = 18, > 365 = 25
  const ageScore = 
    protocolAgeDays < 30 ? 0 :
    protocolAgeDays < 90 ? 10 :
    protocolAgeDays < 365 ? 18 : 25;
  
  // Score TVL: < 1M = 5, 1-10M = 12, 10-100M = 20, > 100M = 25
  const tvlScore = 
    tvl < 1_000_000 ? 5 :
    tvl < 10_000_000 ? 12 :
    tvl < 100_000_000 ? 20 : 25;
  
  // Score exploits: 0 = 25, 1 = 10, 2+ = 0
  const exploitScore = exploitsCount === 0 ? 25 : exploitsCount === 1 ? 10 : 0;
  
  const total = auditScore + ageScore + tvlScore + exploitScore;
  
  return {
    auditScore,
    ageScore,
    tvlScore,
    exploitScore,
    total
  };
}

/**
 * Convertit un score numérique en rating textuel
 */
export function getSecurityRating(score: number): SecurityRating {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'moderate';
  if (score >= 20) return 'risky';
  return 'danger';
}

/**
 * Retourne la couleur associée au rating
 */
export function getRatingColor(rating: SecurityRating): string {
  const colors = {
    excellent: '#22c55e',
    good: '#84cc16',
    moderate: '#eab308',
    risky: '#f97316',
    danger: '#ef4444'
  };
  return colors[rating];
}

/**
 * Retourne le label français du rating
 */
export function getRatingLabel(rating: SecurityRating): string {
  const labels = {
    excellent: 'Excellent',
    good: 'Bon',
    moderate: 'Modéré',
    risky: 'Risqué',
    danger: 'Danger'
  };
  return labels[rating];
}

/**
 * Génère une description du score de sécurité
 */
export function getSecurityDescription(factors: SecurityFactors): string[] {
  const descriptions: string[] = [];
  
  if (factors.auditScore >= 20) {
    descriptions.push('✓ Multiple audits de sécurité');
  } else if (factors.auditScore >= 10) {
    descriptions.push('○ Audité une fois');
  } else {
    descriptions.push('✗ Aucun audit connu');
  }
  
  if (factors.ageScore >= 20) {
    descriptions.push('✓ Protocole établi (> 1 an)');
  } else if (factors.ageScore >= 10) {
    descriptions.push('○ Protocole récent (3-12 mois)');
  } else {
    descriptions.push('✗ Très récent (< 3 mois)');
  }
  
  if (factors.tvlScore >= 20) {
    descriptions.push('✓ Forte liquidité (> $10M)');
  } else if (factors.tvlScore >= 10) {
    descriptions.push('○ Liquidité moyenne');
  } else {
    descriptions.push('✗ Faible liquidité');
  }
  
  if (factors.exploitScore >= 20) {
    descriptions.push('✓ Aucun historique d\'exploit');
  } else if (factors.exploitScore >= 10) {
    descriptions.push('○ 1 incident passé');
  } else {
    descriptions.push('✗ Multiples incidents');
  }
  
  return descriptions;
}

/**
 * Formate un nombre en format lisible
 */
export function formatNumber(num: number): string {
  // Gestion des valeurs invalides
  if (num === undefined || num === null || isNaN(num)) {
    return '$0.00';
  }

  if (num >= 1_000_000_000) {
    return `$${(num / 1_000_000_000).toFixed(2)}B`;
  }
  if (num >= 1_000_000) {
    return `$${(num / 1_000_000).toFixed(2)}M`;
  }
  if (num >= 1_000) {
    return `$${(num / 1_000).toFixed(2)}K`;
  }
  return `$${num.toFixed(2)}`;
}

/**
 * Formate un pourcentage
 */
export function formatPercent(num: number): string {
  // Gestion des valeurs invalides
  if (num === undefined || num === null || isNaN(num)) {
    return '0.00%';
  }
  return `${num.toFixed(2)}%`;
}

/**
 * Formate une date relative
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 1) return 'À l\'instant';
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays < 30) return `Il y a ${diffDays} jours`;
  return date.toLocaleDateString('fr-FR');
}
