# Yiield Public API Documentation

Welcome to the Yiield Public API! This API provides comprehensive access to curated stablecoin yield opportunities across DeFi protocols.

**Base URL:** `https://app.yiield.xyz/api/v1`

## Features

- 🔒 **Curated & Secure**: Only protocols with security score ≥ 60
- 📊 **Comprehensive Data**: 40+ protocols, 13+ chains, 12 stablecoins
- ⚡ **Fast & Cached**: 5-10 minute cache for optimal performance
- 🌐 **CORS Enabled**: Use from any domain
- 🚦 **Rate Limited**: 100 requests/minute per IP
- 📈 **Historical Data**: Hourly APY snapshots stored on Aleph Cloud (IPFS)

## Quick Start

### Get All Pools
```bash
curl https://app.yiield.xyz/api/v1/pools
```

### Get Top USDC Pools
```bash
curl "https://app.yiield.xyz/api/v1/pools?stablecoin=USDC&sort=apy&limit=10"
```

### Get Pool Details
```bash
curl https://app.yiield.xyz/api/v1/pools/{poolId}
```

### Get Aggregate Statistics
```bash
curl https://app.yiield.xyz/api/v1/stats
```

---

## Endpoints

### 1. List All Pools

**GET** `/api/v1/pools`

Returns all yield pools with optional filtering and sorting.

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `stablecoin` | string | - | Filter by stablecoin (USDC, USDT, DAI, etc.). Comma-separated for multiple. |
| `chain` | string | - | Filter by blockchain (Ethereum, Arbitrum, etc.). Comma-separated for multiple. |
| `protocol` | string | - | Filter by protocol name. Comma-separated for multiple. |
| `protocolType` | string | - | Filter by type: `lending` or `vault` |
| `minApy` | number | 0 | Minimum APY threshold (%) |
| `minTvl` | number | 0 | Minimum TVL threshold (USD) |
| `minSecurityScore` | number | 0 | Minimum security score (0-100) |
| `sort` | string | `apy` | Sort field: `apy`, `tvl`, `securityScore`, `yiieldScore` |
| `order` | string | `desc` | Sort order: `asc` or `desc` |
| `limit` | number | 100 | Number of results (max: 500) |
| `offset` | number | 0 | Skip N results for pagination |

#### Example Request

```bash
curl "https://app.yiield.xyz/api/v1/pools?stablecoin=USDC,USDT&chain=Ethereum&minApy=3&sort=yiieldScore&limit=20"
```

#### Example Response

```json
{
  "success": true,
  "data": [
    {
      "id": "aave-v3-usdc-ethereum",
      "protocol": "aave-v3",
      "protocolType": "lending",
      "chain": "Ethereum",
      "stablecoin": "USDC",
      "apy": 3.42,
      "apyBase": 3.42,
      "apyReward": 0,
      "tvl": 1250000000,
      "tvlChange24h": 0.15,
      "securityScore": 95,
      "yiieldScore": 98,
      "poolUrl": "https://app.aave.com/",
      "lastUpdated": "2026-01-23T12:00:00Z"
    }
  ],
  "lastUpdated": "2026-01-23T12:00:00Z",
  "meta": {
    "total": 150,
    "limit": 20,
    "offset": 0,
    "returned": 20,
    "filters": {
      "stablecoin": "USDC,USDT",
      "chain": "Ethereum",
      "minApy": 3
    }
  }
}
```

---

### 2. Get Pool Details

**GET** `/api/v1/pools/{poolId}`

Returns detailed information for a specific pool including security score breakdown and protocol metadata.

#### Example Request

```bash
curl https://app.yiield.xyz/api/v1/pools/aave-v3-usdc-ethereum
```

#### Example Response

```json
{
  "success": true,
  "data": {
    "id": "aave-v3-usdc-ethereum",
    "protocol": "aave-v3",
    "protocolType": "lending",
    "chain": "Ethereum",
    "stablecoin": "USDC",
    "apy": 3.42,
    "apyBase": 3.42,
    "apyReward": 0,
    "tvl": 1250000000,
    "securityScore": 95,
    "yiieldScore": 98,
    "scoreBreakdown": {
      "baseScore": 95,
      "breakdown": {
        "audit": 25,
        "protocolAge": 20,
        "tvl": 25,
        "exploits": 25
      },
      "bonuses": {
        "tier1Auditor": 10,
        "doxxedTeam": 5,
        "insurance": 3,
        "governance": 2
      },
      "totalBonus": 20,
      "yiieldScore": 98,
      "rawTotal": 115
    },
    "protocolInfo": {
      "name": "Aave V3",
      "type": "lending",
      "launchYear": 2022,
      "audits": [
        {
          "auditor": "OpenZeppelin",
          "date": "2022-01",
          "url": "https://..."
        }
      ],
      "exploits": 0,
      "teamStatus": "doxxed",
      "insurance": [
        {
          "provider": "Nexus Mutual",
          "coverage": 50000000
        }
      ],
      "governance": "DAO",
      "url": "https://app.aave.com/"
    },
    "poolUrl": "https://app.aave.com/"
  },
  "lastUpdated": "2026-01-23T12:00:00Z"
}
```

---

### 3. Get Pool History

**GET** `/api/v1/pools/{poolId}/history`

Returns historical APY snapshots for a pool (stored on Aleph Cloud/IPFS).

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `period` | string | `7d` | Time period: `24h`, `7d`, `30d`, `90d` |

#### Example Request

```bash
curl "https://app.yiield.xyz/api/v1/pools/aave-v3-usdc-ethereum/history?period=7d"
```

#### Example Response

```json
{
  "success": true,
  "data": {
    "poolId": "aave-v3-usdc-ethereum",
    "historyId": "aave-v3-usdc-ethereum",
    "protocol": "aave-v3",
    "chain": "Ethereum",
    "stablecoin": "USDC",
    "period": "7d",
    "dataPoints": 168,
    "hourly": [
      {
        "timestamp": "2026-01-23T11:00:00Z",
        "apy": 3.42,
        "tvl": 1250000000
      },
      {
        "timestamp": "2026-01-23T10:00:00Z",
        "apy": 3.40,
        "tvl": 1248000000
      }
    ]
  },
  "lastUpdated": "2026-01-23T12:00:00Z"
}
```

---

### 4. Get Aggregate Statistics

**GET** `/api/v1/stats`

Returns aggregate statistics across all pools.

#### Example Request

```bash
curl https://app.yiield.xyz/api/v1/stats
```

#### Example Response

```json
{
  "success": true,
  "data": {
    "totalTvl": 45000000000,
    "averageApy": 4.2,
    "averageSecurityScore": 78.5,
    "totalPools": 150,
    "protocolCount": 40,
    "chainCount": 13,
    "stablecoinCount": 12,
    "byStablecoin": {
      "USDC": {
        "tvl": 25000000000,
        "avgApy": 4.1,
        "poolCount": 65
      },
      "USDT": {
        "tvl": 15000000000,
        "avgApy": 4.3,
        "poolCount": 50
      }
    },
    "byChain": {
      "Ethereum": {
        "tvl": 20000000000,
        "avgApy": 3.8,
        "poolCount": 45
      },
      "Arbitrum": {
        "tvl": 8000000000,
        "avgApy": 4.5,
        "poolCount": 30
      }
    }
  },
  "lastUpdated": "2026-01-23T12:00:00Z"
}
```

---

### 5. List All Protocols

**GET** `/api/v1/protocols`

Returns list of all supported protocols with metadata.

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `type` | string | - | Filter by type: `lending` or `vault` |

#### Example Request

```bash
curl "https://app.yiield.xyz/api/v1/protocols?type=lending"
```

#### Example Response

```json
{
  "success": true,
  "data": [
    {
      "slug": "aave-v3",
      "name": "Aave V3",
      "type": "lending",
      "launchYear": 2022,
      "audits": [...],
      "auditCount": 5,
      "exploits": 0,
      "teamStatus": "doxxed",
      "insurance": [...],
      "governance": "DAO",
      "tvl": 5000000000,
      "poolCount": 25,
      "chains": ["Ethereum", "Arbitrum", "Optimism"],
      "url": "https://app.aave.com/",
      "logo": "https://..."
    }
  ],
  "lastUpdated": "2026-01-23T12:00:00Z",
  "meta": {
    "total": 40,
    "filters": {
      "type": "lending"
    }
  }
}
```

---

### 6. Get Protocol Details

**GET** `/api/v1/protocols/{slug}`

Returns detailed information for a specific protocol including all its pools.

#### Example Request

```bash
curl https://app.yiield.xyz/api/v1/protocols/aave-v3
```

#### Example Response

```json
{
  "success": true,
  "data": {
    "slug": "aave-v3",
    "name": "Aave V3",
    "type": "lending",
    "launchYear": 2022,
    "description": "Aave is a decentralized lending protocol...",
    "audits": [...],
    "auditCount": 5,
    "exploits": 0,
    "teamStatus": "doxxed",
    "insurance": [...],
    "governance": "DAO",
    "url": "https://app.aave.com/",
    "logo": "https://...",
    "stats": {
      "totalTvl": 5000000000,
      "averageApy": 3.8,
      "poolCount": 25,
      "chains": ["Ethereum", "Arbitrum", "Optimism"],
      "stablecoins": ["USDC", "USDT", "DAI"]
    },
    "pools": [
      {
        "id": "aave-v3-usdc-ethereum",
        "chain": "Ethereum",
        "stablecoin": "USDC",
        "apy": 3.42,
        "tvl": 1250000000,
        "securityScore": 95,
        "yiieldScore": 98,
        "poolUrl": "https://app.aave.com/"
      }
    ]
  },
  "lastUpdated": "2026-01-23T12:00:00Z"
}
```

---

## Rate Limiting

All endpoints are rate-limited to **100 requests per minute per IP address**.

Rate limit information is included in response headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 2026-01-23T12:01:00Z
```

When rate limit is exceeded, you'll receive a `429 Too Many Requests` response:

```json
{
  "success": false,
  "error": "Rate limit exceeded. Please try again later."
}
```

The response includes a `Retry-After` header indicating seconds to wait.

---

## Caching

Responses are cached for optimal performance:

- **Pools & Stats**: 5 minutes
- **Pool History**: 10 minutes
- **Protocols**: 5 minutes

Cache status is indicated by the `lastUpdated` timestamp in each response.

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

### Common HTTP Status Codes

| Status | Description |
|--------|-------------|
| `200` | Success |
| `404` | Resource not found |
| `429` | Rate limit exceeded |
| `500` | Internal server error |

---

## CORS

The API supports CORS and can be accessed from any domain:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## Data Sources

Yiield aggregates data from multiple sources:

1. **DefiLlama API**: Broad protocol coverage
2. **Custom Protocol APIs**: Enhanced accuracy for 10+ protocols
   - Aave GraphQL
   - Venus REST API
   - Kamino, Jupiter, Morpho APIs
   - And more
3. **Aleph Cloud (IPFS)**: Historical APY data storage

Data is refreshed hourly via automated collector service.

---

## Security Scoring

### Security Score (0-100)

Base score calculated from:
- **Audits** (max 25 pts): 5 points per audit
- **Protocol Age** (max 25 pts): 5 points per year
- **TVL** (max 25 pts): Based on TVL tiers
- **Exploits** (max 25 pts): Deducted for past exploits

### Yiield Score (0-100)

Enhanced score with bonuses:
- **Base Security Score** + bonuses
- **Tier-1 Auditor** (+10 pts): OpenZeppelin, Trail of Bits, etc.
- **Doxxed Team** (+5 pts)
- **Insurance Coverage** (+3 pts)
- **DAO Governance** (+2 pts)

---

## Supported Assets

### Stablecoins (12)
- **USD-pegged**: USDC, USDT, DAI, PYUSD, USDe, USDS, USD1, USDG
- **EUR-pegged**: EURe, EURC
- **Gold-backed**: XAUT, PAXG

### Chains (13+)
Ethereum, Arbitrum, Optimism, Base, Polygon, BSC, Avalanche, Solana, Gnosis, Linea, Plasma, Stable, Hyperliquid

### Protocols (40+)
**Lending**: Aave, Compound, Morpho, Spark, Fluid, Euler, Kamino, Jupiter Lend, MarginFi, Venus, and more

**Vaults**: Lagoon, Wildcat, Steakhouse, Concrete, Veda, Mellow, Ether.fi, and more

---

## Usage Examples

### JavaScript/TypeScript

```typescript
// Fetch top USDC pools
async function getTopUSDCPools() {
  const response = await fetch(
    'https://app.yiield.xyz/api/v1/pools?stablecoin=USDC&sort=yiieldScore&limit=10'
  );
  const data = await response.json();
  return data.data;
}

// Get pool with history
async function getPoolWithHistory(poolId: string) {
  const [pool, history] = await Promise.all([
    fetch(`https://app.yiield.xyz/api/v1/pools/${poolId}`).then(r => r.json()),
    fetch(`https://app.yiield.xyz/api/v1/pools/${poolId}/history?period=7d`).then(r => r.json())
  ]);

  return {
    ...pool.data,
    history: history.data.hourly
  };
}
```

### Python

```python
import requests

# Get aggregate stats
def get_stats():
    response = requests.get('https://app.yiield.xyz/api/v1/stats')
    return response.json()

# Get pools filtered by chain and min APY
def get_ethereum_pools(min_apy=3.0):
    params = {
        'chain': 'Ethereum',
        'minApy': min_apy,
        'sort': 'apy',
        'order': 'desc'
    }
    response = requests.get('https://app.yiield.xyz/api/v1/pools', params=params)
    return response.json()['data']
```

### cURL

```bash
# Get all Aave V3 pools
curl "https://app.yiield.xyz/api/v1/protocols/aave-v3"

# Get USDT pools on Arbitrum with high security score
curl "https://app.yiield.xyz/api/v1/pools?stablecoin=USDT&chain=Arbitrum&minSecurityScore=80"

# Get pool history for 30 days
curl "https://app.yiield.xyz/api/v1/pools/aave-v3-usdc-ethereum/history?period=30d"
```

---

## Best Practices

1. **Cache Responses**: Implement client-side caching to reduce API calls
2. **Respect Rate Limits**: Don't exceed 100 requests/minute
3. **Use Filters**: Apply filters to reduce response size
4. **Handle Errors**: Always check the `success` field in responses
5. **Monitor Headers**: Check rate limit headers to avoid hitting limits
6. **Pagination**: Use `limit` and `offset` for large datasets

---

## Support

For issues, questions, or feature requests:
- **Website**: https://yiield.xyz
- **GitHub**: Open an issue in the repository
- **Discord**: Join our community (link on website)

---

## Changelog

### v1.0.0 (2026-01-23)
- Initial API release
- Core endpoints: pools, stats, protocols
- Historical data from Aleph Cloud
- Rate limiting and caching
- CORS support

---

**Built with ❤️ by the Yiield team**

Data stored on Aleph Cloud (decentralized IPFS storage)
