// ============================================
// Aleph IPFS Storage Module
// ============================================

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { CONFIG } from '../config.js';
import { AlephUploadResult, HistoryIndex, PoolHistory } from '../types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_DIR = join(__dirname, '../../data');

// ============================================
// Aleph SDK Integration (Optional)
// ============================================

let alephAccount: any = null;
let alephStorePublish: any = null;
let alephItemType: any = null;

async function initAlephClient(): Promise<boolean> {
  if (!process.env.ALEPH_PRIVATE_KEY) {
    return false;
  }

  try {
    // Dynamic import to handle missing SDK gracefully
    const alephSDK = await import('aleph-sdk-ts');

    // Get Ethereum account using the correct import
    const privateKey = process.env.ALEPH_PRIVATE_KEY;
    alephAccount = alephSDK.accounts.ethereum.ImportAccountFromPrivateKey(privateKey);

    // Get store publish function
    alephStorePublish = alephSDK.messages.store.Publish;

    // ItemType enum - use string values directly since importing types is complex
    alephItemType = {
      inline: 'inline',
      storage: 'storage',
      ipfs: 'ipfs',
    };

    return true;
  } catch (error) {
    console.warn('⚠️ Aleph SDK not available. Using local storage.');
    return false;
  }
}

/**
 * Upload data to Aleph IPFS
 */
export async function uploadToAleph(data: unknown, filename: string): Promise<AlephUploadResult> {
  // Always try local storage first in development
  if (!process.env.ALEPH_PRIVATE_KEY) {
    return uploadToLocal(data, filename);
  }

  const initialized = await initAlephClient();
  if (!initialized || !alephAccount || !alephStorePublish) {
    return uploadToLocal(data, filename);
  }

  try {
    const content = JSON.stringify(data, null, 2);

    const message = await alephStorePublish({
      account: alephAccount,
      fileObject: Buffer.from(content),
      channel: CONFIG.ALEPH_CHANNEL,
      storageEngine: alephItemType?.storage || 'storage',
    });

    const hash = message?.content?.item_hash || message?.item_hash || '';
    console.log(`✅ Uploaded ${filename} to Aleph: ${hash}`);

    return {
      hash,
      success: true,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`❌ Aleph upload error for ${filename}:`, errorMessage);
    // Fallback to local storage
    return uploadToLocal(data, filename);
  }
}

/**
 * Fetch data from Aleph IPFS
 */
export async function fetchFromAleph<T>(hash: string): Promise<T | null> {
  try {
    const url = `${CONFIG.ALEPH_STORAGE_URL}${hash}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json() as T;
    return data;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`❌ Aleph fetch error for ${hash}:`, errorMessage);
    return null;
  }
}

/**
 * Get the current index hash from environment or local storage
 */
export async function getCurrentIndexHash(): Promise<string | null> {
  // First check environment variable
  const envHash = process.env.HISTORY_INDEX_HASH;
  if (envHash) {
    return envHash;
  }

  // Then check local index file
  try {
    const fs = await import('fs/promises');
    const localIndexPath = join(DATA_DIR, 'index-hash.txt');
    const hash = await fs.readFile(localIndexPath, 'utf-8');
    return hash.trim();
  } catch {
    return null;
  }
}

/**
 * Save the current index hash locally
 */
export async function saveIndexHash(hash: string): Promise<void> {
  try {
    const fs = await import('fs/promises');
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(join(DATA_DIR, 'index-hash.txt'), hash);
    console.log(`💾 Index hash saved: ${hash}`);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Failed to save index hash:', errorMessage);
  }
}

// ============================================
// Local File Storage (Development Fallback)
// ============================================

/**
 * Upload data to local filesystem (development mode)
 */
async function uploadToLocal(data: unknown, filename: string): Promise<AlephUploadResult> {
  try {
    const fs = await import('fs/promises');
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.mkdir(join(DATA_DIR, 'pools'), { recursive: true });

    const filePath = join(DATA_DIR, filename);
    const content = JSON.stringify(data, null, 2);
    await fs.writeFile(filePath, content);

    // Generate a pseudo-hash based on content
    const hash = `local-${Buffer.from(content).toString('base64').slice(0, 16)}`;

    console.log(`💾 Saved ${filename} locally`);

    return {
      hash,
      success: true,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`❌ Local save error for ${filename}:`, errorMessage);
    return {
      hash: '',
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Fetch data from local filesystem (development mode)
 */
export async function fetchFromLocal<T>(filename: string): Promise<T | null> {
  try {
    const fs = await import('fs/promises');
    const filePath = join(DATA_DIR, filename);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch {
    return null;
  }
}

/**
 * Get existing pool history from local storage
 */
export async function getExistingPoolHistory(poolId: string): Promise<PoolHistory | null> {
  // Try local first (development)
  const local = await fetchFromLocal<PoolHistory>(`pools/${poolId}.json`);
  if (local) return local;

  // Try Aleph if we have an index hash
  const indexHash = await getCurrentIndexHash();
  if (!indexHash) return null;

  const index = await fetchFromAleph<HistoryIndex>(indexHash);
  if (!index?.pools[poolId]?.hash) return null;

  return fetchFromAleph<PoolHistory>(index.pools[poolId].hash);
}

/**
 * Get existing index from local or Aleph storage
 */
export async function getExistingIndex(): Promise<HistoryIndex | null> {
  // Try local first (development)
  const local = await fetchFromLocal<HistoryIndex>('index.json');
  if (local) return local;

  // Try Aleph
  const indexHash = await getCurrentIndexHash();
  if (!indexHash) return null;

  return fetchFromAleph<HistoryIndex>(indexHash);
}
