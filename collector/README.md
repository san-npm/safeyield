# Yiield APY History Collector

Collects APY and TVL data hourly from DeFi protocols and stores it on IPFS via Aleph.

## Setup

```bash
cd collector
npm install
```

## Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

### Environment Variables

- `ALEPH_PRIVATE_KEY`: Ethereum wallet private key for signing Aleph messages (required for production)
- `HISTORY_INDEX_HASH`: (Optional) Previous index hash to continue from

## Running

### Development (Local Storage)

Without Aleph credentials, data is stored locally in `./data/`:

```bash
npm run collect
```

### Production (Aleph IPFS)

With `ALEPH_PRIVATE_KEY` set, data is uploaded to Aleph IPFS:

```bash
npm run collect
```

## Output

After running, you'll get:
1. Pool history files in `./data/pools/` (or IPFS)
2. Index file at `./data/index.json` (or IPFS)
3. Index hash saved to `./data/index-hash.txt`

## Frontend Integration

After collecting, add the index hash to your frontend `.env.local`:

```bash
NEXT_PUBLIC_HISTORY_INDEX_HASH=<hash-from-collector-output>
```

## Deployment on Aleph VM

1. Create an Aleph VM with Node.js 20+
2. Clone this repo and install dependencies
3. Set up cron job:
   ```bash
   0 * * * * cd /app/collector && npm run collect >> /var/log/collector.log 2>&1
   ```

## Data Schema

### index.json
```json
{
  "version": "1.0.0",
  "lastCollected": "2025-01-20T12:00:00Z",
  "totalPools": 150,
  "pools": {
    "aave-v3-usdc-ethereum": {
      "hash": "QmXyz...",
      "latestApy": 3.42,
      "latestTvl": 1250000000
    }
  }
}
```

### pools/{poolId}.json
```json
{
  "poolId": "aave-v3-usdc-ethereum",
  "protocol": "Aave V3",
  "chain": "Ethereum",
  "stablecoin": "USDC",
  "lastUpdated": "2025-01-20T12:00:00Z",
  "hourly": [
    { "t": "2025-01-20T11:00:00Z", "apy": 3.42, "tvl": 1250000000 }
  ]
}
```

## Data Retention

- **Hourly data**: 7 days (168 points per pool)
- Old data is automatically pruned on each collection
