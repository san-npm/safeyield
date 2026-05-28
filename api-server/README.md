# Yiield Public API

A standalone API server for the Yiield DeFi yield aggregator. This provides RESTful endpoints for accessing stablecoin yield data aggregated from multiple sources.

## Quick Start

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

The server runs on port 3001 by default (configurable via `PORT` environment variable).

## API Endpoints

### Root - API Documentation
```
GET /
```
Returns API documentation and available endpoints.

### Health Check
```
GET /health
```
Returns server health status.

### List All Pools
```
GET /api/v1/pools
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| chain | string | Filter by blockchain (e.g., Ethereum, Arbitrum) |
| stablecoin | string | Filter by stablecoin (e.g., USDC, USDT) |
| protocol | string | Filter by protocol name |
| minApy | number | Minimum APY percentage |
| maxApy | number | Maximum APY percentage |
| minTvl | number | Minimum TVL in USD |
| sort | string | Sort field: apy, tvl, securityScore (default: tvl) |
| order | string | Sort order: asc, desc (default: desc) |
| limit | number | Results per page (default: 100, max: 1000) |
| offset | number | Pagination offset |

**Example:**
```bash
curl "https://api.yiield.xyz/api/v1/pools?chain=Ethereum&stablecoin=USDC&minApy=5&sort=apy&order=desc"
```

### Get Pool by ID
```
GET /api/v1/pools/:id
```

### List All Protocols
```
GET /api/v1/protocols
```

### Get Protocol Pools
```
GET /api/v1/protocols/:slug
```

### Get Statistics
```
GET /api/v1/stats
```

## Response Format

All endpoints return JSON in this format:

```json
{
  "success": true,
  "data": [...],
  "meta": {
    "total": 500,
    "page": 1,
    "limit": 100,
    "lastUpdated": "2024-01-15T12:00:00Z"
  }
}
```

## Data Sources

- **DefiLlama Yields API** - Primary source for yield data
- **Merkl API** - Additional incentive rewards

## Deployment Options

### Railway (Recommended)
1. Connect your GitHub repository
2. Set environment variable `PORT=3001`
3. Deploy

### Render
1. Create a new Web Service
2. Connect GitHub repository
3. Build command: `npm run build`
4. Start command: `npm start`

### Fly.io
```bash
fly launch
fly deploy
```

### Docker
```dockerfile
FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["node", "dist/index.js"]
```

### Vercel (Serverless)
Not recommended for this server architecture. Use Railway or Render instead.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 3001 | Server port |

## Caching

Data is cached for 5 minutes to reduce load on upstream APIs. The cache is automatically refreshed on first request after TTL expiration.

## Rate Limiting

No rate limiting is currently implemented. Consider adding rate limiting for production use with packages like `express-rate-limit`.

## CORS

CORS is enabled for all origins. Modify the `cors()` configuration in `src/index.ts` to restrict origins if needed.

## Aleph Cloud Deployment

See [ALEPH_DEPLOYMENT.md](./ALEPH_DEPLOYMENT.md) for detailed instructions on deploying to Aleph Cloud.

Quick start:
```bash
# Build Docker image
docker build -t yiield-api:latest .

# Test locally
docker run -p 3001:3001 yiield-api:latest

# Push to registry
docker tag yiield-api:latest yourusername/yiield-api:latest
docker push yourusername/yiield-api:latest

# Deploy via Aleph Console at https://console.aleph.im
```

## License

MIT
