// ============================================
// 🛠️ API UTILITIES - Shared helpers for API routes
// ============================================

import { NextRequest, NextResponse } from 'next/server';

// ============================================
// RESPONSE FORMATTING
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  lastUpdated?: string;
  meta?: Record<string, unknown>;
}

export function successResponse<T>(
  data: T,
  meta?: Record<string, unknown>
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    lastUpdated: new Date().toISOString(),
    ...(meta && { meta }),
  });
}

export function errorResponse(
  error: string,
  status = 500
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status }
  );
}

// ============================================
// CACHING
// ============================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class MemoryCache {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  get<T>(key: string, ttl?: number): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;

    const maxAge = ttl || this.defaultTTL;
    if (Date.now() - entry.timestamp > maxAge) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}

export const cache = new MemoryCache();

// ============================================
// RATE LIMITING
// ============================================

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests = 100, windowMs = 60 * 1000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  check(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const entry = this.limits.get(identifier);

    // No entry or window expired - create new window
    if (!entry || now > entry.resetTime) {
      const resetTime = now + this.windowMs;
      this.limits.set(identifier, { count: 1, resetTime });
      return { allowed: true, remaining: this.maxRequests - 1, resetTime };
    }

    // Within window - check limit
    if (entry.count >= this.maxRequests) {
      return { allowed: false, remaining: 0, resetTime: entry.resetTime };
    }

    // Increment count
    entry.count++;
    this.limits.set(identifier, entry);
    return {
      allowed: true,
      remaining: this.maxRequests - entry.count,
      resetTime: entry.resetTime,
    };
  }

  // Cleanup old entries periodically
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.limits.entries()) {
      if (now > entry.resetTime) {
        this.limits.delete(key);
      }
    }
  }
}

// Global rate limiter instance
export const rateLimiter = new RateLimiter(100, 60 * 1000); // 100 requests per minute

// Cleanup old entries every 5 minutes
if (typeof window === 'undefined') {
  // Only run on server
  setInterval(() => rateLimiter.cleanup(), 5 * 60 * 1000);
}

/**
 * Get client identifier for rate limiting
 */
export function getClientIdentifier(request: NextRequest): string {
  // Try to get IP from various headers (for proxies/CDNs)
  const forwarded = request.headers.get('x-forwarded-for');
  const real = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || real || 'unknown';

  // TODO: If API keys are added, use the API key instead
  return ip;
}

/**
 * Apply rate limiting to a request
 */
export function applyRateLimit(request: NextRequest): {
  allowed: boolean;
  response?: NextResponse;
  headers: Record<string, string>;
} {
  const identifier = getClientIdentifier(request);
  const { allowed, remaining, resetTime } = rateLimiter.check(identifier);

  const headers = {
    'X-RateLimit-Limit': '100',
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': new Date(resetTime).toISOString(),
  };

  if (!allowed) {
    const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
    return {
      allowed: false,
      response: NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Please try again later.',
        },
        {
          status: 429,
          headers: {
            ...headers,
            'Retry-After': retryAfter.toString(),
          },
        }
      ),
      headers,
    };
  }

  return { allowed: true, headers };
}

// ============================================
// CORS HEADERS
// ============================================

export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400', // 24 hours
};

/**
 * Add CORS and common headers to response
 */
export function addHeaders(
  response: NextResponse,
  additionalHeaders?: Record<string, string>
): NextResponse {
  Object.entries({ ...CORS_HEADERS, ...additionalHeaders }).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

// ============================================
// QUERY PARAMETER PARSING
// ============================================

export function parseNumberParam(
  searchParams: URLSearchParams,
  key: string,
  defaultValue: number
): number {
  const value = searchParams.get(key);
  if (!value) return defaultValue;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

export function parseStringParam(
  searchParams: URLSearchParams,
  key: string,
  defaultValue?: string
): string | undefined {
  return searchParams.get(key) || defaultValue;
}

export function parseArrayParam(
  searchParams: URLSearchParams,
  key: string
): string[] {
  const value = searchParams.get(key);
  if (!value) return [];
  return value.split(',').map(v => v.trim()).filter(Boolean);
}

export function parseBooleanParam(
  searchParams: URLSearchParams,
  key: string,
  defaultValue = false
): boolean {
  const value = searchParams.get(key);
  if (!value) return defaultValue;
  return value === 'true' || value === '1';
}
