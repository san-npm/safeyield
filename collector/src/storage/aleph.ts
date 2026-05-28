// ============================================
// Aleph IPFS Storage Module
//
// Uses the modern @aleph-sdk/* scoped packages.
//
// Failure semantics:
//   - If ALEPH_PRIVATE_KEY is set, uploads to Aleph are MANDATORY. Any
//     SDK or network error propagates out so the caller (and the CI
//     workflow) can fail loudly instead of silently committing a
//     "local-..." pseudo-hash that the frontend then can't fetch.
//   - If ALEPH_PRIVATE_KEY is unset, the module falls back to writing
//     under collector/data/ for local development.
// ============================================

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { AuthenticatedAlephHttpClient } from '@aleph-sdk/client';
import { ETHAccount, importAccountFromPrivateKey } from '@aleph-sdk/ethereum';
import { ItemType } from '@aleph-sdk/message';
import { CONFIG } from '../config.js';
import { AlephUploadResult, HistoryIndex, PoolHistory } from '../types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_DIR = join(__dirname, '../../data');

let alephClient: AuthenticatedAlephHttpClient | null = null;
let alephAccount: ETHAccount | null = null;
let initAttempted = false;

function alephEnabled(): boolean {
  return Boolean(process.env.ALEPH_PRIVATE_KEY);
}

function initAlephClient(): { client: AuthenticatedAlephHttpClient; account: ETHAccount } | null {
  if (initAttempted) {
    return alephClient && alephAccount ? { client: alephClient, account: alephAccount } : null;
  }
  initAttempted = true;

  const privateKey = process.env.ALEPH_PRIVATE_KEY;
  if (!privateKey) {
    console.log('ℹ️ ALEPH_PRIVATE_KEY not set — using local storage (development mode)');
    return null;
  }

  alephAccount = importAccountFromPrivateKey(privateKey);
  alephClient = new AuthenticatedAlephHttpClient(alephAccount);
  console.log(`✅ Aleph client initialized for ${alephAccount.address}`);

  return { client: alephClient, account: alephAccount };
}

/**
 * Upload data to Aleph IPFS storage. Throws when ALEPH_PRIVATE_KEY is set and
 * the upload fails, so callers (notably the CI workflow) can surface the
 * failure instead of silently downgrading to local pseudo-hashes.
 */
export async function uploadToAleph(data: unknown, filename: string): Promise<AlephUploadResult> {
  const ctx = initAlephClient();
  if (!ctx) {
    return uploadToLocal(data, filename);
  }

  const content = JSON.stringify(data, null, 2);
  const message = await ctx.client.createStore({
    channel: CONFIG.ALEPH_CHANNEL,
    fileObject: Buffer.from(content),
    storageEngine: ItemType.storage,
    sync: true,
  });

  const hash = message.item_hash;
  if (!hash) {
    throw new Error(`Aleph createStore for ${filename} returned no item_hash`);
  }

  console.log(`☁️ Uploaded ${filename} to Aleph: ${hash}`);
  return { hash, success: true };
}

/**
 * Fetch data from Aleph IPFS via the public storage gateway.
 */
export async function fetchFromAleph<T>(hash: string): Promise<T | null> {
  try {
    const response = await fetch(`${CONFIG.ALEPH_STORAGE_URL}${hash}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return (await response.json()) as T;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`❌ Aleph fetch error for ${hash}:`, errorMessage);
    return null;
  }
}

/**
 * Read the current index hash from environment or local cache file.
 */
export async function getCurrentIndexHash(): Promise<string | null> {
  const envHash = process.env.HISTORY_INDEX_HASH;
  if (envHash) {
    return envHash;
  }
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
 * Persist the current index hash locally for follow-up runs.
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

async function uploadToLocal(data: unknown, filename: string): Promise<AlephUploadResult> {
  const fs = await import('fs/promises');
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(join(DATA_DIR, 'pools'), { recursive: true });

  const filePath = join(DATA_DIR, filename);
  const content = JSON.stringify(data, null, 2);
  await fs.writeFile(filePath, content);

  // Pseudo-hash so the rest of the pipeline has something stable to key on,
  // but prefixed so anything downstream can detect that this is NOT an
  // Aleph CID and reject it (the frontend filters these out).
  const hash = `local-${Buffer.from(content).toString('base64').slice(0, 16)}`;

  console.log(`💾 Saved ${filename} locally (hash: ${hash})`);
  return { hash, success: true };
}

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
 * Get existing pool history. Tries local cache first (dev), then Aleph if
 * we have an index hash pointing into the network.
 */
export async function getExistingPoolHistory(poolId: string): Promise<PoolHistory | null> {
  const local = await fetchFromLocal<PoolHistory>(`pools/${poolId}.json`);
  if (local) return local;

  const indexHash = await getCurrentIndexHash();
  if (!indexHash || indexHash.startsWith('local-')) return null;

  const index = await fetchFromAleph<HistoryIndex>(indexHash);
  if (!index?.pools[poolId]?.hash) return null;
  return fetchFromAleph<PoolHistory>(index.pools[poolId].hash);
}

/**
 * Get the existing history index from local cache or from Aleph.
 */
export async function getExistingIndex(): Promise<HistoryIndex | null> {
  const local = await fetchFromLocal<HistoryIndex>('index.json');
  if (local) return local;

  const indexHash = await getCurrentIndexHash();
  if (!indexHash || indexHash.startsWith('local-')) return null;
  return fetchFromAleph<HistoryIndex>(indexHash);
}

/**
 * Whether Aleph publishing is enabled (i.e. an account key is configured).
 * Callers can use this to decide whether to abort the run vs degrade.
 */
export function isAlephEnabled(): boolean {
  return alephEnabled();
}
