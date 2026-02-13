# 🧪 API Testing Guide

This guide will help you test the Yiield Public API locally and in production.

## 🚀 Quick Start - Local Testing

### 1. Start the Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3000/api/v1`

### 2. Test Basic Endpoints

Open a new terminal and run these commands:

#### Test Stats Endpoint (Simplest)
```bash
curl http://localhost:3000/api/v1/stats | jq
```

Expected response:
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
    "byStablecoin": { ... },
    "byChain": { ... }
  },
  "lastUpdated": "2026-01-23T..."
}
```

#### Test Pools Endpoint
```bash
# Get all pools (limited to 10)
curl "http://localhost:3000/api/v1/pools?limit=10" | jq

# Get USDC pools only
curl "http://localhost:3000/api/v1/pools?stablecoin=USDC&limit=5" | jq

# Get pools on Ethereum with min APY
curl "http://localhost:3000/api/v1/pools?chain=Ethereum&minApy=3&limit=5" | jq

# Get high security score pools
curl "http://localhost:3000/api/v1/pools?minSecurityScore=80&sort=yiieldScore&limit=10" | jq
```

#### Test Pool Details
```bash
# First, get a pool ID from the pools endpoint
POOL_ID=$(curl -s "http://localhost:3000/api/v1/pools?limit=1" | jq -r '.data[0].id')

# Get pool details
curl "http://localhost:3000/api/v1/pools/$POOL_ID" | jq

# Get pool history (if available)
curl "http://localhost:3000/api/v1/pools/$POOL_ID/history?period=7d" | jq
```

#### Test Protocols
```bash
# Get all protocols
curl http://localhost:3000/api/v1/protocols | jq

# Get specific protocol (e.g., Aave V3)
curl http://localhost:3000/api/v1/protocols/aave-v3 | jq
```

---

## 🔍 Detailed Testing Scenarios

### Scenario 1: Find Best USDC Yields

```bash
# Get top 5 USDC pools by Yiield Score
curl -s "http://localhost:3000/api/v1/pools?stablecoin=USDC&sort=yiieldScore&order=desc&limit=5" | jq '.data[] | {protocol, chain, apy, yiieldScore}'
```

### Scenario 2: Compare Chains

```bash
# Get stats for Ethereum
curl -s http://localhost:3000/api/v1/stats | jq '.data.byChain.Ethereum'

# Get stats for Arbitrum
curl -s http://localhost:3000/api/v1/stats | jq '.data.byChain.Arbitrum'
```

### Scenario 3: Protocol Research

```bash
# Get all Aave V3 pools
curl -s http://localhost:3000/api/v1/protocols/aave-v3 | jq '.data.pools'

# Get protocol security info
curl -s http://localhost:3000/api/v1/protocols/aave-v3 | jq '.data | {auditors, teamStatus, insurance, governance}'
```

### Scenario 4: Historical Analysis

```bash
# Get 30-day history for a specific pool
curl -s "http://localhost:3000/api/v1/pools/aave-v3-usdc-ethereum/history?period=30d" | jq '.data.hourly | length'

# Calculate average APY over period
curl -s "http://localhost:3000/api/v1/pools/aave-v3-usdc-ethereum/history?period=7d" | \
  jq '[.data.hourly[].apy] | add / length'
```

---

## 🧪 Testing with Different Tools

### Using HTTPie (More Readable)

```bash
# Install httpie: brew install httpie (macOS) or apt-get install httpie (Linux)

http localhost:3000/api/v1/stats
http localhost:3000/api/v1/pools stablecoin==USDC limit==5
http localhost:3000/api/v1/protocols/aave-v3
```

### Using JavaScript/Fetch

```javascript
// Test in browser console on localhost:3000
async function testAPI() {
  // Get stats
  const stats = await fetch('/api/v1/stats').then(r => r.json());
  console.log('Stats:', stats);

  // Get top USDC pools
  const pools = await fetch('/api/v1/pools?stablecoin=USDC&limit=5').then(r => r.json());
  console.log('Top USDC pools:', pools);

  // Get specific pool
  const poolId = pools.data[0].id;
  const pool = await fetch(`/api/v1/pools/${poolId}`).then(r => r.json());
  console.log('Pool details:', pool);

  // Get history
  const history = await fetch(`/api/v1/pools/${poolId}/history?period=7d`).then(r => r.json());
  console.log('History points:', history.data?.hourly?.length);
}

testAPI();
```

### Using Python

```python
import requests
import json

BASE_URL = "http://localhost:3000/api/v1"

# Test stats
response = requests.get(f"{BASE_URL}/stats")
print(json.dumps(response.json(), indent=2))

# Test pools with filters
params = {
    "stablecoin": "USDC",
    "minApy": 3,
    "sort": "yiieldScore",
    "limit": 5
}
response = requests.get(f"{BASE_URL}/pools", params=params)
pools = response.json()
print(f"Found {len(pools['data'])} pools")

# Test protocol
response = requests.get(f"{BASE_URL}/protocols/aave-v3")
protocol = response.json()
print(f"Protocol: {protocol['data']['name']}")
print(f"TVL: ${protocol['data']['stats']['totalTvl']:,.0f}")
```

---

## 🚦 Testing Rate Limiting

The API allows 100 requests per minute per IP. Test it:

```bash
# Send 105 requests rapidly
for i in {1..105}; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/v1/stats)
  echo "Request $i: HTTP $STATUS"
  if [ "$STATUS" = "429" ]; then
    echo "✓ Rate limit working! Got 429 Too Many Requests"
    break
  fi
done
```

Expected output: Should see HTTP 200 for first 100 requests, then HTTP 429.

---

## 📊 Performance Testing

### Test Response Times

```bash
# Simple timing
time curl -s http://localhost:3000/api/v1/pools?limit=100 > /dev/null

# Detailed timing
curl -w "@-" -o /dev/null -s "http://localhost:3000/api/v1/pools?limit=100" <<'EOF'
    time_namelookup:  %{time_namelookup}\n
       time_connect:  %{time_connect}\n
    time_appconnect:  %{time_appconnect}\n
   time_pretransfer:  %{time_pretransfer}\n
      time_redirect:  %{time_redirect}\n
 time_starttransfer:  %{time_starttransfer}\n
                    ----------\n
         time_total:  %{time_total}\n
EOF
```

### Test Cache Effectiveness

```bash
# First request (uncached)
time curl -s http://localhost:3000/api/v1/stats > /dev/null

# Second request (should be cached, faster)
time curl -s http://localhost:3000/api/v1/stats > /dev/null

# Wait 6 minutes and try again (cache expired)
sleep 360
time curl -s http://localhost:3000/api/v1/stats > /dev/null
```

Expected: 2nd request should be significantly faster (cached).

---

## ✅ Validation Checklist

Before deploying to production, verify:

- [ ] All 6 endpoints return valid JSON
- [ ] CORS headers are present (check with browser DevTools)
- [ ] Rate limiting triggers at 100 req/min
- [ ] Caching works (2nd request faster than 1st)
- [ ] Filters work correctly (stablecoin, chain, protocol, minApy, etc.)
- [ ] Sorting works (apy, tvl, securityScore, yiieldScore)
- [ ] Pagination works (limit, offset)
- [ ] Historical data loads from Aleph Cloud
- [ ] Error responses have proper status codes (404, 429, 500)
- [ ] Response times are acceptable (< 1s for pools, < 500ms for stats)

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module 'next/server'"

**Solution**: This is a TypeScript check issue, not a runtime issue. The API will work fine. If it bothers you, install types:
```bash
npm install --save-dev @types/node
```

### Issue: Empty pools array

**Solution**:
1. Check if DefiLlama API is accessible
2. Verify `YIIELD_PROTOCOLS` has protocols configured
3. Check minimum security score threshold (60)

### Issue: No historical data

**Solution**:
1. Verify `NEXT_PUBLIC_HISTORY_INDEX_HASH` is set
2. Check `/apy-history-hash.txt` file exists
3. Ensure Aleph Cloud is accessible

### Issue: Rate limit errors immediately

**Solution**: The rate limiter resets every minute. Wait 60 seconds and try again.

---

## 📈 Production Testing

Once deployed to production (e.g., app.yiield.xyz):

```bash
# Replace localhost with your domain
BASE_URL="https://app.yiield.xyz/api/v1"

# Test stats
curl "$BASE_URL/stats" | jq

# Test pools
curl "$BASE_URL/pools?stablecoin=USDC&limit=5" | jq

# Test CORS (should work from browser)
curl -H "Origin: https://example.com" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     --verbose \
     "$BASE_URL/pools"
```

Expected CORS headers in response:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## 🎯 Integration Examples

### React/Next.js Integration

```typescript
// hooks/useYiieldAPI.ts
import { useState, useEffect } from 'react';

export function useTopPools(stablecoin: string, limit = 10) {
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/v1/pools?stablecoin=${stablecoin}&sort=yiieldScore&limit=${limit}`)
      .then(r => r.json())
      .then(data => {
        setPools(data.data);
        setLoading(false);
      });
  }, [stablecoin, limit]);

  return { pools, loading };
}
```

### Node.js Backend Integration

```javascript
// server.js
const express = require('express');
const app = express();

app.get('/best-yields', async (req, res) => {
  const response = await fetch('https://app.yiield.xyz/api/v1/pools?sort=yiieldScore&limit=20');
  const data = await response.json();

  // Process and return
  res.json(data.data.map(pool => ({
    name: `${pool.protocol} ${pool.stablecoin} on ${pool.chain}`,
    apy: pool.apy,
    score: pool.yiieldScore
  })));
});
```

---

## 📚 Additional Resources

- **API Documentation**: See `API.md` for complete endpoint reference
- **Rate Limits**: 100 requests/minute per IP
- **Cache TTL**: 5-10 minutes depending on endpoint
- **Data Freshness**: Updated hourly via collector service

---

**Happy Testing! 🎉**

If you encounter any issues, check the server logs with `npm run dev` for detailed error messages.
