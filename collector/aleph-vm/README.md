# Aleph VM Deployment for APY Collector

This guide explains how to deploy the APY collector on an Aleph VM as a backup to GitHub Actions.

## Prerequisites

1. An Aleph account with ALEPH tokens (~50 ALEPH for VM deployment)
2. Your `ALEPH_PRIVATE_KEY` (same one used for storage)

## Deployment Steps

### 1. Install Aleph CLI

```bash
pip install aleph-client
```

### 2. Create the VM

```bash
aleph instance create \
  --name "yiield-apy-collector" \
  --memory 512 \
  --vcpus 1 \
  --rootfs-size 2048 \
  --image debian-12 \
  --ssh-pubkey-file ~/.ssh/id_rsa.pub
```

### 3. SSH into the VM

```bash
aleph instance ssh yiield-apy-collector
```

### 4. Install Node.js and setup

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs git

# Clone the repository
git clone https://github.com/clementfrmd/safeyield.git /app
cd /app/collector

# Install dependencies
npm ci

# Create .env file
cat > .env << EOF
ALEPH_PRIVATE_KEY=your_private_key_here
EOF
```

### 5. Setup cron job

```bash
# Edit crontab
crontab -e

# Add this line (runs every hour at minute 30 to avoid conflict with GitHub Actions)
30 * * * * cd /app/collector && npm run collect >> /var/log/apy-collector.log 2>&1
```

### 6. Test the collector

```bash
cd /app/collector
npm run collect
```

## Monitoring

Check logs:
```bash
tail -f /var/log/apy-collector.log
```

## Cost

- VM: ~$15-25/month in ALEPH tokens
- Storage: Included (same account)

## Redundancy

With both GitHub Actions (minute 0) and Aleph VM (minute 30), you get:
- 2 collection attempts per hour
- Automatic failover if one fails
- Decentralized backup
