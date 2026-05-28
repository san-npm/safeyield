import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { fetchAllPools, getProtocols, getStats } from './fetcher';
import { ApiResponse, YieldPool, Protocol, Stats } from './types';

const app = express();
const PORT = process.env.PORT || 3001;

// Trust upstream proxy (Aleph gateway, Cloudflare, etc.) so rate limiting
// keys on the real client IP rather than the proxy's IP.
app.set('trust proxy', 1);

// CORS — explicit allowlist. Override via ALLOWED_ORIGINS env var (comma-separated).
const DEFAULT_ORIGINS = [
  'https://yiield.xyz',
  'https://www.yiield.xyz',
  'http://localhost:3000',
];
const allowedOrigins = (process.env.ALLOWED_ORIGINS?.split(',').map(s => s.trim()).filter(Boolean))
  || DEFAULT_ORIGINS;
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'HEAD', 'OPTIONS'],
  maxAge: 600,
}));

// Body parser with explicit small limit (this API is read-only and never reads JSON bodies)
app.use(express.json({ limit: '8kb' }));

// Rate limiting — 120 requests per minute per IP. Override via RATE_LIMIT_PER_MIN env var.
const rateLimitMax = Number(process.env.RATE_LIMIT_PER_MIN) || 120;
app.use(rateLimit({
  windowMs: 60_000,
  limit: rateLimitMax,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests' },
}));

// Whitelisted sort fields. Anything else falls back to the default to prevent
// arbitrary property access on response objects.
const POOL_SORT_FIELDS = new Set(['apy', 'tvl', 'securityScore', 'yiieldScore', 'apyBase', 'apyReward']);
const PROTOCOL_SORT_FIELDS = new Set(['totalTvl', 'poolCount', 'avgApy', 'securityScore']);
function safeSort<T extends Record<string, unknown>>(items: T[], rawField: string, rawOrder: string, allowed: Set<string>, defaultField: string): T[] {
  const field = allowed.has(rawField) ? rawField : defaultField;
  const direction = rawOrder === 'asc' ? 1 : -1;
  return items.sort((a, b) => {
    const av = (a[field] as number) ?? 0;
    const bv = (b[field] as number) ?? 0;
    return (av - bv) * direction;
  });
}

// Root endpoint - API documentation
app.get('/', (req, res) => {
  res.json({
    name: 'Yiield Public API',
    version: '1.0.0',
    description: 'DeFi stablecoin yield aggregator API',
    documentation: 'https://www.yiield.xyz/api-docs',
    endpoints: {
      'GET /api/v1/pools': 'List all stablecoin yield pools',
      'GET /api/v1/pools/:id': 'Get a specific pool by ID',
      'GET /api/v1/protocols': 'List all protocols',
      'GET /api/v1/protocols/:slug': 'Get pools for a specific protocol',
      'GET /api/v1/stats': 'Get aggregated statistics',
      'GET /health': 'Health check endpoint',
    },
    queryParameters: {
      chain: 'Filter by blockchain (e.g., Ethereum, Arbitrum)',
      stablecoin: 'Filter by stablecoin (e.g., USDC, USDT)',
      minApy: 'Minimum APY percentage',
      maxApy: 'Maximum APY percentage',
      minTvl: 'Minimum TVL in USD',
      sort: 'Sort field. Pools: apy, tvl, securityScore, yiieldScore, apyBase, apyReward. Protocols: totalTvl, poolCount, avgApy, securityScore. Unknown values fall back to the default.',
      order: 'Sort order (asc, desc)',
      limit: 'Number of results (default: 100, max: 1000)',
      offset: 'Pagination offset',
    },
    dataSources: [
      'DefiLlama Yields API',
      'Merkl Incentives API',
    ],
    rateLimit: `${rateLimitMax} requests / minute / IP`,
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GET /api/v1/pools - List all pools with filtering
app.get('/api/v1/pools', async (req, res) => {
  try {
    let pools = await fetchAllPools();

    // Filtering
    const { chain, stablecoin, minApy, maxApy, minTvl, protocol } = req.query;

    if (chain) {
      pools = pools.filter(p => p.chain.toLowerCase() === String(chain).toLowerCase());
    }
    if (stablecoin) {
      pools = pools.filter(p => p.stablecoin.toLowerCase() === String(stablecoin).toLowerCase());
    }
    if (protocol) {
      pools = pools.filter(p => p.protocol.toLowerCase().includes(String(protocol).toLowerCase()));
    }
    if (minApy) {
      pools = pools.filter(p => p.apy >= Number(minApy));
    }
    if (maxApy) {
      pools = pools.filter(p => p.apy <= Number(maxApy));
    }
    if (minTvl) {
      pools = pools.filter(p => p.tvl >= Number(minTvl));
    }

    // Sorting (whitelisted)
    const sort = String(req.query.sort || 'tvl');
    const order = String(req.query.order || 'desc');
    pools = safeSort(pools as unknown as Record<string, unknown>[], sort, order, POOL_SORT_FIELDS, 'tvl') as unknown as YieldPool[];

    // Pagination — clamp inputs to safe ranges
    const limit = Math.min(Math.max(Number(req.query.limit) || 100, 1), 1000);
    const offset = Math.max(Number(req.query.offset) || 0, 0);
    const total = pools.length;
    pools = pools.slice(offset, offset + limit);

    const response: ApiResponse<YieldPool[]> = {
      success: true,
      data: pools,
      meta: {
        total,
        page: Math.floor(offset / limit) + 1,
        limit,
        lastUpdated: new Date().toISOString(),
      },
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching pools:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/v1/pools/:id - Get single pool
app.get('/api/v1/pools/:id', async (req, res) => {
  try {
    const pools = await fetchAllPools();
    const pool = pools.find(p => p.id === req.params.id);

    if (!pool) {
      return res.status(404).json({ success: false, error: 'Pool not found' });
    }

    const response: ApiResponse<YieldPool> = {
      success: true,
      data: pool,
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching pool:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/v1/protocols - List all protocols
app.get('/api/v1/protocols', async (req, res) => {
  try {
    let protocols = await getProtocols();

    // Sorting (whitelisted)
    const sort = String(req.query.sort || 'totalTvl');
    const order = String(req.query.order || 'desc');
    protocols = safeSort(protocols as unknown as Record<string, unknown>[], sort, order, PROTOCOL_SORT_FIELDS, 'totalTvl') as unknown as Protocol[];

    // Pagination — clamp inputs to safe ranges
    const limit = Math.min(Math.max(Number(req.query.limit) || 100, 1), 500);
    const offset = Math.max(Number(req.query.offset) || 0, 0);
    const total = protocols.length;
    protocols = protocols.slice(offset, offset + limit);

    const response: ApiResponse<Protocol[]> = {
      success: true,
      data: protocols,
      meta: {
        total,
        page: Math.floor(offset / limit) + 1,
        limit,
      },
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching protocols:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/v1/protocols/:slug - Get pools for a specific protocol
app.get('/api/v1/protocols/:slug', async (req, res) => {
  try {
    const pools = await fetchAllPools();
    const slug = req.params.slug.toLowerCase();
    const protocolPools = pools.filter(p =>
      p.protocol.toLowerCase().replace(/\s+/g, '-') === slug ||
      p.protocol.toLowerCase() === slug
    );

    if (protocolPools.length === 0) {
      return res.status(404).json({ success: false, error: 'Protocol not found' });
    }

    const response: ApiResponse<YieldPool[]> = {
      success: true,
      data: protocolPools,
      meta: {
        total: protocolPools.length,
      },
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching protocol pools:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/v1/stats - Get aggregated statistics
app.get('/api/v1/stats', async (req, res) => {
  try {
    const stats = await getStats();

    const response: ApiResponse<Stats> = {
      success: true,
      data: stats,
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🌱 Yiield API Server                                ║
║                                                       ║
║   Running on http://localhost:${PORT}                   ║
║                                                       ║
║   Endpoints:                                          ║
║   • GET /api/v1/pools      - List all pools           ║
║   • GET /api/v1/pools/:id  - Get pool by ID           ║
║   • GET /api/v1/protocols  - List all protocols       ║
║   • GET /api/v1/stats      - Get statistics           ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);

  // Pre-warm cache
  fetchAllPools().catch(console.error);
});
