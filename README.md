# Yiield

**Compare the best stablecoin yields across DeFi — with a security score that actually means something.**

Live app: [www.yiield.xyz](https://www.yiield.xyz) · Built by [COMMIT MEDIA](mailto:contact@yiield.xyz) · Hosted on [Aleph Cloud](https://aleph.cloud)

---

## What it does

Yiield aggregates stablecoin yields from 20+ DeFi protocols across 12 chains and ranks them with the **Yiield Score** — a proprietary 0–100 security rating so users can compare returns *and* risk side by side. The full app is statically exported and served from Aleph Cloud's decentralized IPFS network — no centralized backend.

Supported assets (12 canonical):

| USD | EUR | Gold |
|-----|-----|------|
| USDC · USDT · DAI · PYUSD · USDe · USDS · USD1 · USDG | EURe · EURC | XAUT · PAXG |

Supported chains: Ethereum · Arbitrum · Optimism · Base · Polygon · BNB Chain · Avalanche · Solana · Gnosis · Linea · Hyperliquid · Plasma.

UI is available in 5 languages: English · French · German · Spanish · Italian.

---

## The Yiield Score

A weighted 0–100 rating, reviewed weekly:

| Dimension | Weight | What we look at |
|-----------|-------:|-----------------|
| **Audit quality** | 30% | Tiered firm rating. Tier 1 (Trail of Bits, OpenZeppelin, Consensys Diligence, Spearbit, ChainSecurity, Sigma Prime) = +10 / Tier 2 (Certik, PeckShield, Halborn, Quantstamp, OtterSec, Zellic, Nethermind, Cantina, Certora, MixBytes) = +6 / Tier 3 (Sherlock, Code4rena, Hacken, others) = +3 |
| **Team transparency** | 25% | Doxxed identities, verifiable history, active comms |
| **Protocol maturity** | 20% | Time since mainnet, TVL stability, exploit history, recovery quality |
| **Governance** | 15% | Timelock (24h+), multisig (3/5+), DAO process, pause controls |
| **Insurance & coverage** | 10% | Nexus Mutual, InsurAce, native funds, Immunefi bounty |

Protocols marked **Verified by Yiield** have had direct contact with the team and enhanced due diligence.

---

## Architecture

A monorepo with three independent workspaces:

| Path | Stack | Role |
|------|-------|------|
| `src/` | Next.js 14 (App Router) · TypeScript · Tailwind · Recharts · Framer Motion | Static frontend dApp, deployed as `out/` to Aleph IPFS |
| `collector/` | Node 20 · `aleph-sdk-ts` · ethers v5 | Hourly cron — pulls APY from DefiLlama + custom protocol APIs, writes per-pool history + index to Aleph IPFS, commits the new index hash back to the repo |
| `api-server/` | Express · TypeScript | Public REST API (`/api/v1/pools`, `/protocols`, `/stats`) with filtering, sorting, pagination |

The frontend reads `public/apy-history-hash.txt` at runtime, then fetches per-pool history directly from Aleph IPFS — no centralized database, no backend dependency for the core UX.

---

## Local development

Requires Node.js 20+.

```bash
# Install deps for each workspace
npm install
npm --prefix collector install
npm --prefix api-server install

# Run the frontend (http://localhost:3000)
npm run dev

# Build the static export for Aleph
npm run build      # output: ./out/

# Run the API server (http://localhost:3001)
cd api-server && npm run dev

# Manually run the APY collector (needs ALEPH_PRIVATE_KEY)
cd collector && npm run collect
```

---

## APY History collector

`.github/workflows/collect-apy.yml` runs hourly:

1. Reads the current index hash from `public/apy-history-hash.txt`.
2. Fetches pools from DefiLlama + protocol-specific APIs in parallel; merges by `protocol–chain–stablecoin`.
3. Appends a new hourly data point per pool, prunes points outside the retention window, uploads each `pools/<id>.json` and a unified `index.json` to Aleph IPFS.
4. Commits the new index hash back so the static frontend picks it up.

Required secret: `ALEPH_PRIVATE_KEY`.

---

## Public REST API

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/pools` | List pools — filter by `chain`, `stablecoin`, `protocol`, `minApy`, `maxApy`, `minTvl`; sort by `apy`, `tvl`, `securityScore`; paginate via `limit`, `offset` |
| `GET /api/v1/pools/:id` | Single pool by id |
| `GET /api/v1/protocols` | All protocols with aggregated TVL |
| `GET /api/v1/protocols/:slug` | Pools for one protocol |
| `GET /api/v1/stats` | Aggregated TVL, average APY, pool count |
| `GET /health` | Liveness check |

Full docs: [www.yiield.xyz/api-docs](https://www.yiield.xyz/api-docs).

---

## Deployment (Aleph Cloud)

```bash
npm run build
# Upload ./out/ via the Aleph console (https://console.aleph.cloud)
# OR via the CLI: aleph file upload ./out --channel yiield
```

Bind a custom domain to the resulting item hash from the Aleph console (DOMAINS → Add). Three DNS records on the parent domain:

- `CNAME` `<subdomain>` → `ipfs.public.aleph.sh`
- `CNAME` `_dnslink.<subdomain>` → `_dnslink.<subdomain>.static.public.aleph.sh`
- `TXT`   `_control.<subdomain>` → controller wallet address

---

## Stack

- **Frontend** — Next.js 14, React 18, TypeScript, Tailwind, Recharts, Framer Motion, lucide-react
- **Web3** — ethers v5, aleph-sdk-ts
- **Collector** — Node 20, GitHub Actions
- **API** — Express, TypeScript
- **Hosting** — Aleph Cloud (decentralized IPFS)
- **Data** — DefiLlama Yields API + protocol-specific integrations (Merkl, custom)

---

## Contact

[contact@yiield.xyz](mailto:contact@yiield.xyz) — for protocol inclusion, partnerships, feedback.

## License

MIT © COMMIT MEDIA 2026
