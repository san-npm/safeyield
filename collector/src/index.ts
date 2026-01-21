// ============================================
// APY History Collector - Main Entry Point
// ============================================

import { CONFIG } from './config.js';
import { fetchDefiLlamaPools } from './fetchers/defillama.js';
import { fetchAllCustomPools } from './fetchers/protocols.js';
import {
  uploadToAleph,
  getExistingPoolHistory,
  getExistingIndex,
  saveIndexHash,
} from './storage/aleph.js';
import {
  PoolData,
  PoolHistory,
  HourlyDataPoint,
  HistoryIndex,
  PoolIndexEntry,
} from './types.js';

/**
 * Merge pools from different sources, preferring custom API data
 */
function mergePools(defiLlamaPools: PoolData[], customPools: PoolData[]): PoolData[] {
  const poolMap = new Map<string, PoolData>();

  // Add DefiLlama pools first
  for (const pool of defiLlamaPools) {
    const key = `${pool.protocol}-${pool.chain}-${pool.stablecoin}`.toLowerCase();
    poolMap.set(key, pool);
  }

  // Override with custom API pools (more accurate)
  for (const pool of customPools) {
    const key = `${pool.protocol}-${pool.chain}-${pool.stablecoin}`.toLowerCase();
    poolMap.set(key, pool);
  }

  return Array.from(poolMap.values());
}

/**
 * Create a new data point for the current hour
 */
function createDataPoint(pool: PoolData): HourlyDataPoint {
  return {
    t: new Date().toISOString(),
    apy: pool.apy,
    tvl: pool.tvl,
  };
}

/**
 * Prune old data points beyond retention period
 */
function pruneOldData(hourly: HourlyDataPoint[]): HourlyDataPoint[] {
  const cutoffDate = new Date();
  cutoffDate.setHours(cutoffDate.getHours() - CONFIG.RETENTION_HOURS);
  const cutoffISO = cutoffDate.toISOString();

  return hourly.filter(point => point.t >= cutoffISO);
}

/**
 * Update or create pool history with new data point
 */
async function updatePoolHistory(pool: PoolData): Promise<PoolHistory> {
  // Get existing history if available
  const existing = await getExistingPoolHistory(pool.id);

  const newPoint = createDataPoint(pool);

  let hourly: HourlyDataPoint[];
  if (existing) {
    // Avoid duplicates within the same hour
    const lastPoint = existing.hourly[0];
    if (lastPoint) {
      const lastHour = new Date(lastPoint.t).getHours();
      const currentHour = new Date().getHours();
      const lastDay = new Date(lastPoint.t).getDate();
      const currentDay = new Date().getDate();

      if (lastHour === currentHour && lastDay === currentDay) {
        // Update the existing point instead of adding a new one
        existing.hourly[0] = newPoint;
        hourly = pruneOldData(existing.hourly);
      } else {
        // Add new point at the beginning
        hourly = pruneOldData([newPoint, ...existing.hourly]);
      }
    } else {
      hourly = [newPoint];
    }
  } else {
    hourly = [newPoint];
  }

  return {
    poolId: pool.id,
    protocol: pool.protocol,
    chain: pool.chain,
    stablecoin: pool.stablecoin,
    lastUpdated: new Date().toISOString(),
    hourly,
  };
}

/**
 * Main collection function
 */
async function collect(): Promise<void> {
  console.log('🚀 Starting APY collection...');
  console.log(`📅 ${new Date().toISOString()}`);
  console.log('');

  try {
    // Fetch pools from all sources in parallel
    const [defiLlamaPools, customPools] = await Promise.all([
      fetchDefiLlamaPools(),
      fetchAllCustomPools(),
    ]);

    console.log('');
    console.log(`📊 DefiLlama pools: ${defiLlamaPools.length}`);
    console.log(`📊 Custom API pools: ${customPools.length}`);

    // Merge pools
    const allPools = mergePools(defiLlamaPools, customPools);
    console.log(`📊 Total unique pools: ${allPools.length}`);
    console.log('');

    // Get existing index
    const existingIndex = await getExistingIndex();

    // Update history for each pool
    const indexEntries: Record<string, PoolIndexEntry> = {};
    let successCount = 0;
    let errorCount = 0;

    for (const pool of allPools) {
      try {
        // Update pool history
        const history = await updatePoolHistory(pool);

        // Upload pool history
        const result = await uploadToAleph(history, `pools/${pool.id}.json`);

        if (result.success) {
          indexEntries[pool.id] = {
            hash: result.hash,
            latestApy: pool.apy,
            latestTvl: pool.tvl,
          };
          successCount++;
        } else {
          errorCount++;
        }
      } catch (error: any) {
        console.error(`❌ Error processing ${pool.id}:`, error.message);
        errorCount++;
      }
    }

    console.log('');
    console.log(`✅ Successfully processed: ${successCount} pools`);
    if (errorCount > 0) {
      console.log(`❌ Errors: ${errorCount} pools`);
    }

    // Create and upload new index
    const newIndex: HistoryIndex = {
      version: '1.0.0',
      lastCollected: new Date().toISOString(),
      totalPools: Object.keys(indexEntries).length,
      pools: indexEntries,
    };

    const indexResult = await uploadToAleph(newIndex, 'index.json');

    if (indexResult.success) {
      console.log('');
      console.log('📋 Index uploaded successfully');
      console.log(`   Hash: ${indexResult.hash}`);

      // Save hash for future reference
      await saveIndexHash(indexResult.hash);

      console.log('');
      console.log('💡 Set this environment variable in your frontend:');
      console.log(`   NEXT_PUBLIC_HISTORY_INDEX_HASH=${indexResult.hash}`);
    } else {
      console.error('❌ Failed to upload index');
    }

    console.log('');
    console.log('✅ Collection complete!');

  } catch (error: any) {
    console.error('❌ Collection failed:', error.message);
    process.exit(1);
  }
}

// Run collection
collect().catch(console.error);
