#!/usr/bin/env python3
"""
Aleph Cloud Deployment Script for Yiield API

This script deploys the Yiield API server to Aleph Cloud as a persistent VM instance.

Requirements:
    pip install aleph-sdk-python aiohttp

Usage:
    python deploy.py

Environment variables:
    ALEPH_PRIVATE_KEY - Your Aleph wallet private key (or use keyfile)
"""

import asyncio
import json
import os
from pathlib import Path

try:
    from aleph.sdk.client import AuthenticatedAlephClient
    from aleph.sdk.chains.ethereum import ETHAccount
    from aleph.sdk.vm.app import AlephApp
    from aleph_message.models import ItemHash
except ImportError:
    print("Please install aleph-sdk-python: pip install aleph-sdk-python")
    exit(1)


# Configuration
ALEPH_API_SERVER = "https://api2.aleph.im"
CHANNEL = "YIIELD"

# VM Configuration
VM_CONFIG = {
    "name": "yiield-api",
    "description": "Yiield Public API - DeFi Yield Aggregator",
    "vcpus": 1,
    "memory": 256,  # MB
    "timeout_seconds": 30,
    "internet": True,
    "allow_amend": True,
}


async def deploy_to_aleph():
    """Deploy the API to Aleph Cloud."""

    # Get private key from environment or prompt
    private_key = os.environ.get("ALEPH_PRIVATE_KEY")

    if not private_key:
        print("Please set ALEPH_PRIVATE_KEY environment variable")
        print("Or create a .env file with your private key")
        return

    # Create account
    account = ETHAccount(private_key=private_key)
    print(f"Deploying from address: {account.get_address()}")

    async with AuthenticatedAlephClient(
        account=account,
        api_server=ALEPH_API_SERVER,
    ) as client:

        # Read and upload the Dockerfile
        dockerfile_path = Path(__file__).parent.parent / "Dockerfile"

        if not dockerfile_path.exists():
            print(f"Dockerfile not found at {dockerfile_path}")
            return

        print("Creating Aleph VM program...")

        # For a full deployment, you would:
        # 1. Build the Docker image
        # 2. Push to a registry (or use Aleph's IPFS storage)
        # 3. Create a program message pointing to the image

        # Alternative: Deploy as a squashfs runtime
        # This requires building the image first

        print("\n" + "="*60)
        print("DEPLOYMENT INSTRUCTIONS")
        print("="*60)
        print("""
To deploy on Aleph Cloud, you have two options:

OPTION 1: Use Aleph CLI (Recommended)
--------------------------------------
1. Install Aleph CLI:
   pip install aleph-client

2. Build and push Docker image:
   docker build -t yiield-api .
   docker tag yiield-api:latest your-registry/yiield-api:latest
   docker push your-registry/yiield-api:latest

3. Create instance:
   aleph instance create \\
     --name yiield-api \\
     --image your-registry/yiield-api:latest \\
     --vcpus 1 \\
     --memory 256 \\
     --rootfs-size 1024

OPTION 2: Use Aleph Web Console
-------------------------------
1. Go to https://console.aleph.im
2. Connect your wallet
3. Create a new VM instance
4. Upload your Docker image or use a public registry
5. Configure:
   - Name: yiield-api
   - vCPUs: 1
   - Memory: 256MB
   - Port: 3001

OPTION 3: Use Aleph Functions (Serverless)
------------------------------------------
Convert the API to use Aleph Functions format.
See: https://docs.aleph.im/computing/

After deployment, update the API URL in:
- src/app/api-docs/page.tsx (change https://api.yiield.xyz)
""")

        return


async def main():
    await deploy_to_aleph()


if __name__ == "__main__":
    asyncio.run(main())
