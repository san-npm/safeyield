# 🚀 Deployment Guide - Yiield Public API

## Prerequisites

Before deploying, ensure you have:
- ✅ All changes committed to your branch
- ✅ Tests passing locally
- ✅ Environment variables configured (if needed)

---

## Deployment Options

### Option 1: Vercel (Recommended - Easiest)

**Why Vercel?**
- Built specifically for Next.js
- Automatic deployments on push
- Free tier includes Edge Functions
- Zero configuration needed

**Steps:**

1. **Push your code to GitHub** (already done):
   ```bash
   git checkout main
   git merge claude/public-api-aleph-cloud-hvdrw
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import `clementfrmd/safeyield`
   - Click "Deploy"

3. **Configure Environment Variables** (if needed):
   - In Vercel dashboard → Settings → Environment Variables
   - Add these if not using default values:
     ```
     NEXT_PUBLIC_HISTORY_INDEX_HASH=<your-hash>
     NEXT_PUBLIC_BASE_URL=https://app.yiield.xyz
     ```

4. **Done!** Your API will be live at:
   ```
   https://app.yiield.xyz/api/v1/*
   ```

**Automatic Deployments:**
- Every push to `main` = Production deployment
- Every push to other branches = Preview deployment

---

### Option 2: Netlify

**Steps:**

1. **Create `netlify.toml`** (already included below)

2. **Connect to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Sign in with GitHub
   - Click "New site from Git"
   - Select your repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Click "Deploy"

3. **Configure Environment Variables**:
   - Site settings → Environment variables
   - Add same variables as Vercel

---

### Option 3: Self-Hosted (VPS/Cloud)

**Requirements:**
- Node.js 18+
- PM2 or similar process manager
- Nginx or similar reverse proxy

**Steps:**

1. **Build the application**:
   ```bash
   npm install
   npm run build
   ```

2. **Start with PM2**:
   ```bash
   npm install -g pm2
   pm2 start npm --name "yiield-api" -- start
   pm2 save
   pm2 startup
   ```

3. **Configure Nginx**:
   ```nginx
   server {
       listen 80;
       server_name app.yiield.xyz;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **Setup SSL with Let's Encrypt**:
   ```bash
   sudo certbot --nginx -d app.yiield.xyz
   ```

---

## Pre-Deployment Checklist

Before going live, verify these steps:

### ✅ Code Quality
- [ ] All TypeScript errors resolved
- [ ] No console.errors in production code
- [ ] All endpoints tested locally
- [ ] Rate limiting tested
- [ ] Caching verified

### ✅ Security
- [ ] Environment variables secured
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] No sensitive data in responses
- [ ] Error messages don't expose internals

### ✅ Performance
- [ ] Build succeeds: `npm run build`
- [ ] Production bundle analyzed
- [ ] API response times acceptable
- [ ] Caching working properly

### ✅ Documentation
- [ ] API.md reviewed
- [ ] Environment variables documented
- [ ] Deployment steps documented

---

## Testing Before Deployment

### 1. Local Production Build

```bash
# Build for production
npm run build

# Start production server
npm start

# Test all endpoints
curl http://localhost:3000/api/v1/stats
curl http://localhost:3000/api/v1/pools?limit=5
```

### 2. Test Critical Paths

```bash
# Test filtering
curl "http://localhost:3000/api/v1/pools?stablecoin=USDC&minApy=3"

# Test pool details
POOL_ID=$(curl -s http://localhost:3000/api/v1/pools?limit=1 | jq -r '.data[0].id')
curl "http://localhost:3000/api/v1/pools/$POOL_ID"

# Test history (if available)
curl "http://localhost:3000/api/v1/pools/$POOL_ID/history?period=7d"

# Test protocols
curl http://localhost:3000/api/v1/protocols
```

### 3. Load Testing (Optional)

```bash
# Install Apache Bench
# macOS: brew install httpd
# Ubuntu: apt-get install apache2-utils

# Test 1000 requests, 10 concurrent
ab -n 1000 -c 10 http://localhost:3000/api/v1/stats

# Expected results:
# - Requests per second: 100+
# - Time per request: < 100ms (cached)
# - Time per request: < 2s (uncached)
# - Failed requests: 0
```

---

## Post-Deployment Verification

After deployment, verify these endpoints are working:

### 1. Health Check

```bash
BASE_URL="https://app.yiield.xyz"

# Test stats endpoint
curl "$BASE_URL/api/v1/stats" | jq '.success'
# Expected: true

# Test pools endpoint
curl "$BASE_URL/api/v1/pools?limit=1" | jq '.meta.total'
# Expected: number > 0

# Test CORS headers
curl -I -H "Origin: https://example.com" "$BASE_URL/api/v1/stats" | grep -i "access-control"
# Expected: Access-Control-Allow-Origin: *
```

### 2. Performance Check

```bash
# Check response time (should be fast after first request)
time curl -s "$BASE_URL/api/v1/stats" > /dev/null
# Expected: < 1 second

# Check cache (second request should be faster)
time curl -s "$BASE_URL/api/v1/stats" > /dev/null
# Expected: < 0.5 seconds
```

### 3. Error Handling

```bash
# Test 404 (non-existent pool)
curl "$BASE_URL/api/v1/pools/nonexistent" | jq '.success'
# Expected: false

# Test rate limiting (send 105 requests)
for i in {1..105}; do
  curl -s -o /dev/null -w "%{http_code}\n" "$BASE_URL/api/v1/stats"
done | tail -5
# Expected: Last requests should return 429
```

---

## Environment Variables

### Required
None! The API works without any environment variables.

### Optional
```bash
# History data hash (falls back to /apy-history-hash.txt)
NEXT_PUBLIC_HISTORY_INDEX_HASH=abc123...

# Base URL for Aleph Cloud fetching
NEXT_PUBLIC_BASE_URL=https://app.yiield.xyz
```

**How to set:**
- **Vercel**: Dashboard → Settings → Environment Variables
- **Netlify**: Site settings → Environment variables
- **Self-hosted**: Create `.env.production` file

---

## Monitoring & Maintenance

### What to Monitor

1. **API Errors**
   - Check Vercel/Netlify logs
   - Look for 500 errors
   - Monitor error rates

2. **Response Times**
   - Average response time should be < 1s
   - Cached responses should be < 200ms
   - Slow responses indicate issues

3. **Rate Limiting**
   - Check for excessive 429 errors
   - Adjust limits if needed
   - Consider API keys for heavy users

4. **Data Freshness**
   - Verify collector is running hourly
   - Check Aleph Cloud connectivity
   - Monitor DefiLlama API availability

### Monitoring Tools

**Free Options:**
- Vercel Analytics (built-in)
- Netlify Analytics (built-in)
- UptimeRobot (external monitoring)
- Google Cloud Monitoring (free tier)

**Recommended Setup:**
```bash
# UptimeRobot - Monitor these endpoints every 5 minutes:
https://app.yiield.xyz/api/v1/stats
https://app.yiield.xyz/api/v1/pools?limit=1

# Alert if down for > 2 minutes
```

---

## Rollback Plan

If something goes wrong after deployment:

### Vercel
1. Go to Deployments page
2. Find previous working deployment
3. Click "..." → "Promote to Production"
4. Done! Instant rollback.

### Netlify
1. Go to Deploys
2. Find previous deploy
3. Click "Publish deploy"
4. Done!

### Self-Hosted
```bash
# Revert git commit
git revert HEAD
git push origin main

# Or rollback to specific commit
git reset --hard <previous-commit-hash>
git push origin main --force

# Rebuild and restart
npm run build
pm2 restart yiield-api
```

---

## Troubleshooting

### Issue: API returns 500 errors

**Check:**
1. Vercel/Netlify function logs
2. Is DefiLlama API accessible?
3. Are there TypeScript errors?

**Fix:**
```bash
# Test locally first
npm run build
npm start

# Check for errors in console
```

### Issue: No historical data

**Check:**
1. Is `NEXT_PUBLIC_HISTORY_INDEX_HASH` set?
2. Does `/apy-history-hash.txt` exist?
3. Is Aleph Cloud accessible?

**Fix:**
```bash
# Verify hash file exists
curl https://app.yiield.xyz/apy-history-hash.txt

# Test Aleph Cloud directly
HASH=$(cat public/apy-history-hash.txt)
curl "https://api2.aleph.im/api/v0/storage/raw/$HASH"
```

### Issue: Rate limit errors immediately

**Cause:** Rate limiter state persists in memory

**Fix:**
- Wait 60 seconds for window to reset
- Or restart the server (clears memory)
- Or adjust rate limit in `src/lib/api/utils.ts`

### Issue: Slow responses

**Check:**
1. Is caching working? (2nd request should be faster)
2. Is DefiLlama API slow?
3. Are you on Edge Runtime?

**Fix:**
```bash
# Verify Edge Runtime in route files:
grep "export const runtime" src/app/api/v1/**/*.ts
# Should see: export const runtime = 'edge';

# If not, add to each route file
```

---

## Scaling Considerations

### When to Scale

Monitor these metrics:
- **Requests/minute** > 1000 consistently
- **Response times** > 2s average
- **Error rate** > 1%
- **Cache hit ratio** < 70%

### How to Scale

1. **Add Redis Cache** (if needed)
   - Replace in-memory cache with Redis
   - Shared cache across all instances
   - Better for high traffic

2. **Increase Rate Limits** (for authenticated users)
   - Add API key system
   - Higher limits for key holders
   - Track usage per key

3. **CDN Caching**
   - Add Cloudflare in front
   - Cache at edge locations
   - Even faster responses

4. **Database for History** (optional)
   - Store history in PostgreSQL
   - Faster queries than IPFS
   - Better for analytics

---

## Cost Estimates

### Vercel (Recommended)
- **Free tier**: 100GB bandwidth, 100k edge requests
- **Pro tier**: $20/month for unlimited
- **Enterprise**: Custom pricing

**Expected costs:**
- 0-100k requests/month: **$0**
- 100k-1M requests/month: **$0-20**
- 1M+ requests/month: **$20-100**

### Netlify
- **Free tier**: 100GB bandwidth, 125k serverless hours
- **Pro tier**: $19/month
- Similar to Vercel

### Self-Hosted (VPS)
- **DigitalOcean**: $6-12/month (basic droplet)
- **AWS Lightsail**: $5-20/month
- **Hetzner**: €4-10/month (EU)

**Trade-offs:**
- ✅ Cheaper for high traffic
- ❌ More maintenance required
- ❌ No automatic scaling

---

## Next Steps After Deployment

1. **Announce the API**
   - Update website documentation
   - Blog post about the API
   - Tweet/announce on social media

2. **Gather Usage Data**
   - Track most-used endpoints
   - Monitor error patterns
   - Collect user feedback

3. **Iterate**
   - Add requested features
   - Optimize slow endpoints
   - Improve documentation

4. **Consider Premium Features**
   - API keys for tracking
   - Higher rate limits for paid users
   - Webhooks for alerts
   - Custom integrations

---

## Support

If you encounter issues:
1. Check Vercel/Netlify deployment logs
2. Review `API_TESTING.md` for debugging
3. Test locally with `npm run build && npm start`
4. Check GitHub Issues

---

**Ready to deploy?** Choose your platform and follow the steps above! 🚀

**Recommended:** Start with Vercel for easiest setup, then optimize later if needed.
