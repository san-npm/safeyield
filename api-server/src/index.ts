import express from 'express';
import cors from 'cors';
import { fetchAllPools, getProtocols, getStats } from './fetcher';
import { ApiResponse, YieldPool, Protocol, Stats } from './types';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

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
      sort: 'Sort field (apy, tvl, securityScore)',
      order: 'Sort order (asc, desc)',
      limit: 'Number of results (default: 100, max: 1000)',
      offset: 'Pagination offset',
    },
    dataSources: [
      'DefiLlama Yields API',
      'Merkl Incentives API',
    ],
    rateLimit: 'No rate limiting currently applied',
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

    // Sorting
    const sort = String(req.query.sort || 'tvl');
    const order = String(req.query.order || 'desc');

    pools.sort((a, b) => {
      const aVal = (a as any)[sort] || 0;
      const bVal = (b as any)[sort] || 0;
      return order === 'asc' ? aVal - bVal : bVal - aVal;
    });

    // Pagination
    const limit = Math.min(Number(req.query.limit) || 100, 1000);
    const offset = Number(req.query.offset) || 0;
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

    // Sorting
    const sort = String(req.query.sort || 'totalTvl');
    const order = String(req.query.order || 'desc');

    protocols.sort((a, b) => {
      const aVal = (a as any)[sort] || 0;
      const bVal = (b as any)[sort] || 0;
      return order === 'asc' ? aVal - bVal : bVal - aVal;
    });

    // Pagination
    const limit = Math.min(Number(req.query.limit) || 100, 500);
    const offset = Number(req.query.offset) || 0;
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
