#!/bin/bash
# Aleph VM Setup Script for Yiield APY Collector
# Run this script after SSHing into your Aleph VM

set -e

echo "🚀 Setting up Yiield APY Collector on Aleph VM..."

# Update system
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Install Node.js 20
echo "📦 Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs git

# Verify installation
echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Clone repository
echo "📥 Cloning repository..."
if [ -d "/app" ]; then
    cd /app && git pull
else
    git clone https://github.com/clementfrmd/safeyield.git /app
fi

# Install dependencies
echo "📦 Installing collector dependencies..."
cd /app/collector
npm ci

# Create .env file if not exists
if [ ! -f ".env" ]; then
    echo "⚠️  Please create /app/collector/.env with your ALEPH_PRIVATE_KEY"
    echo "Example:"
    echo "  echo 'ALEPH_PRIVATE_KEY=0x...' > /app/collector/.env"
fi

# Setup cron job
echo "⏰ Setting up cron job..."
CRON_JOB="30 * * * * cd /app/collector && npm run collect >> /var/log/apy-collector.log 2>&1"

# Check if cron job already exists
if ! crontab -l 2>/dev/null | grep -q "apy-collector"; then
    (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
    echo "✅ Cron job added (runs at minute 30 of every hour)"
else
    echo "ℹ️  Cron job already exists"
fi

# Create log file
touch /var/log/apy-collector.log
chmod 644 /var/log/apy-collector.log

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Add your private key: echo 'ALEPH_PRIVATE_KEY=0x...' > /app/collector/.env"
echo "2. Test the collector: cd /app/collector && npm run collect"
echo "3. Monitor logs: tail -f /var/log/apy-collector.log"
