#!/bin/bash
# Yiield API Server Setup Script for Aleph Cloud (Debian/Ubuntu)
# Run this script after creating your instance

set -e

echo "=========================================="
echo "  Yiield API Server Setup"
echo "=========================================="

# Update system
echo "Updating system packages..."
apt-get update && apt-get upgrade -y

# Install Node.js 20.x
echo "Installing Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Install git
apt-get install -y git

# Create app directory
mkdir -p /opt/yiield-api
cd /opt/yiield-api

# Clone the repository (or copy files)
echo "Downloading Yiield API..."
git clone --depth 1 https://github.com/clementfrmd/safeyield.git .

# Navigate to API server
cd api-server

# Install dependencies
echo "Installing dependencies..."
npm ci --only=production

# Build TypeScript
echo "Building..."
npm run build

# Create systemd service
echo "Creating systemd service..."
cat > /etc/systemd/system/yiield-api.service << 'EOF'
[Unit]
Description=Yiield Public API Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/yiield-api/api-server
ExecStart=/usr/bin/node dist/index.js
Restart=on-failure
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3001

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
systemctl daemon-reload
systemctl enable yiield-api
systemctl start yiield-api

# Configure firewall (if ufw is installed)
if command -v ufw &> /dev/null; then
    ufw allow 3001/tcp
fi

echo "=========================================="
echo "  Setup Complete!"
echo "=========================================="
echo ""
echo "API is running on port 3001"
echo "Test: curl http://localhost:3001/health"
echo ""
echo "To check status: systemctl status yiield-api"
echo "To view logs: journalctl -u yiield-api -f"
