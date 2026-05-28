# Deploying Yiield API on Aleph Cloud

This guide explains how to deploy the Yiield Public API on Aleph Cloud's decentralized compute platform.

## Prerequisites

- Docker installed locally
- An Aleph Cloud account (connect wallet at https://console.aleph.im)
- ALEPH tokens for compute costs (minimal)

## Option 1: Aleph Console (Easiest)

### Step 1: Build Docker Image

```bash
cd api-server
docker build -t yiield-api:latest .
```

### Step 2: Test Locally

```bash
docker run -p 3001:3001 yiield-api:latest
# Test: curl http://localhost:3001/health
```

### Step 3: Push to Registry

You can use Docker Hub, GitHub Container Registry, or any public registry:

```bash
# Docker Hub
docker tag yiield-api:latest yourusername/yiield-api:latest
docker push yourusername/yiield-api:latest

# GitHub Container Registry
docker tag yiield-api:latest ghcr.io/yourusername/yiield-api:latest
docker push ghcr.io/yourusername/yiield-api:latest
```

### Step 4: Deploy via Aleph Console

1. Go to https://console.aleph.im
2. Connect your wallet (MetaMask, WalletConnect, etc.)
3. Navigate to **Computing** → **Create Instance**
4. Configure:
   - **Name**: `yiield-api`
   - **Image**: `yourusername/yiield-api:latest`
   - **vCPUs**: 1
   - **Memory**: 256 MB
   - **Rootfs Size**: 1 GB
   - **Ports**: 3001
5. Click **Create**

### Step 5: Get Your API URL

After deployment, Aleph will provide you with a URL like:
```
https://your-vm-id.aleph.sh
```

## Option 2: Aleph CLI

### Install CLI

```bash
pip install aleph-client
```

### Deploy

```bash
# Export your private key
export ALEPH_PRIVATE_KEY=your_private_key

# Create instance
aleph instance create \
  --name yiield-api \
  --image yourusername/yiield-api:latest \
  --vcpus 1 \
  --memory 256 \
  --rootfs-size 1024 \
  --port 3001
```

## Option 3: Aleph Persistent VM

For a more permanent deployment, create a persistent VM:

### Create squashfs Image

```bash
# Build and export image
docker build -t yiield-api:latest .
docker save yiield-api:latest | gzip > yiield-api.tar.gz

# Convert to squashfs (requires squashfs-tools)
# Or use Aleph's image builder
```

### Deploy with Aleph SDK

```python
from aleph.sdk.client import AuthenticatedAlephClient
from aleph.sdk.chains.ethereum import ETHAccount

account = ETHAccount(private_key=os.environ["ALEPH_PRIVATE_KEY"])

async with AuthenticatedAlephClient(account=account) as client:
    # Upload and deploy
    pass
```

## Post-Deployment

### Update API URL

After getting your Aleph deployment URL, update the frontend:

1. Edit `src/app/api-docs/page.tsx`
2. Replace `https://api.yiield.xyz` with your Aleph URL
3. Rebuild and redeploy the static site

### Custom Domain (Optional)

To use `api.yiield.xyz`:

1. Add a CNAME record pointing to your Aleph VM
2. Or use Cloudflare to proxy to the Aleph URL

### Monitoring

- Check health: `curl https://your-vm-id.aleph.sh/health`
- View logs in Aleph Console
- Set up alerts for downtime

## Costs

Aleph Cloud pricing is based on:
- Compute time (vCPUs × hours)
- Memory usage
- Storage

For a 1 vCPU / 256MB instance, expect minimal costs (~$5-10/month in ALEPH tokens).

## Troubleshooting

### Container won't start
- Check Docker image builds successfully locally
- Verify port 3001 is exposed
- Check Aleph Console logs

### API returns errors
- Verify environment variables
- Check if external APIs (DefiLlama, Merkl) are accessible from Aleph

### High latency
- Consider deploying to multiple regions
- Enable caching in the API (already implemented with 5-minute TTL)

## Support

- Aleph Docs: https://docs.aleph.im
- Aleph Discord: https://discord.gg/aleph-im
- Yiield GitHub: https://github.com/clementfrmd/safeyield
