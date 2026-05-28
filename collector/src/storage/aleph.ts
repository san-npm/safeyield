// ============================================
// Aleph IPFS Storage Module
//
// Uses the modern @aleph-sdk/* scoped packages.
//
// Failure semantics:
//   - If ALEPH_PRIVATE_KEY is set, uploads to Aleph are MANDATORY. Any
//     SDK or network error propagates out so the caller (and the CI
//     workflow) can fail loudly instead of silently downgrading to a
//     "local-..." pseudo-hash that the frontend then can't fetch.
//   - If ALEPH_PRIVATE_KEY is unset, the module falls back to writing
//     under collector/data/ for local development.
//
// Upload strategy — two-step approach (avoids /api/v0/storage/add_file):
//
//   The SDK's createStore() routes through /api/v0/storage/add_file, which
//   requires authenticated ALEPH token balance for the "hold" payment tier
//   (the production API does not yet accept the payment field on STORE
//   messages, so credit/hold overrides both 422). This account has 0 free
//   ALEPH tokens, causing every add_file call to return HTTP 422.
//
//   Instead we use the well-established two-step flow that the original
//   Python aleph-client also used (as evidenced by the three successful
//   STOREs from January 2026 on this account):
//
//   1. POST JSON content to /api/v0/storage/add_json (no auth needed).
//      The Aleph node stores the content and returns its SHA-256 hash.
//   2. Build an inline STORE message whose content points to that hash
//      (item_type="storage", item_hash=<sha256 from step 1>).
//      Sign with the account private key, broadcast to /api/v0/messages.
//      The /api/v0/messages endpoint skips balance checks for STORE — it
//      just validates the message schema + signature.
//
//   The resulting item_hash (sha256 of the inline message content) is a
//   64-char hex string, which the workflow's ^[a-f0-9]{64}$ validator
//   accepts.
// ============================================

import { createHash } from 'crypto';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { ETHAccount, importAccountFromPrivateKey } from '@aleph-sdk/ethereum';
import { ItemType, MessageType } from '@aleph-sdk/message';
import { Blockchain } from '@aleph-sdk/core';
import { CONFIG } from '../config.js';
import { AlephUploadResult, HistoryIndex, PoolHistory } from '../types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_DIR = join(__dirname, '../../data');

let alephAccount: ETHAccount | null = null;
let alephApiServer: string = 'https://api2.aleph.im';
let initAttempted = false;

function alephEnabled(): boolean {
  return Boolean(process.env.ALEPH_PRIVATE_KEY);
}

function initAlephAccount(): ETHAccount | null {
  if (initAttempted) return alephAccount;
  initAttempted = true;

  const privateKey = process.env.ALEPH_PRIVATE_KEY;
  if (!privateKey) {
    console.log('ℹ️ ALEPH_PRIVATE_KEY not set — using local storage (development mode)');
    return null;
  }

  // The SDK's built-in default points at api3.aleph.im, which is currently
  // unreachable from CI runners. Use api2.aleph.im. Allow overriding via
  // ALEPH_API_SERVER so we can flip endpoints without a code change when
  // api3 comes back.
  alephApiServer = process.env.ALEPH_API_SERVER || 'https://api2.aleph.im';

  alephAccount = importAccountFromPrivateKey(privateKey);
  console.log(`✅ Aleph client initialized for ${alephAccount.address} (api: ${alephApiServer})`);

  return alephAccount;
}

/**
 * Step 1: Upload raw JSON to /api/v0/storage/add_json (no authentication needed).
 * Returns the SHA-256 hex hash of the stored content.
 */
async function uploadJsonToStorage(jsonContent: string): Promise<string> {
  const url = `${alephApiServer}/api/v0/storage/add_json`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: jsonContent,
  });
  if (!response.ok) {
    const body = await response.text().catch(() => '<no body>');
    throw new Error(`Aleph storage/add_json failed (${response.status}): ${body.slice(0, 300)}`);
  }
  const result = await response.json() as { status: string; hash: string };
  if (!result.hash) {
    throw new Error(`Aleph storage/add_json returned no hash: ${JSON.stringify(result)}`);
  }
  return result.hash;
}

/**
 * Step 2: Build an inline STORE message, sign it, and broadcast it to
 * /api/v0/messages.  The message content points to the storage hash from
 * step 1. Returns the message's item_hash (sha256 of the inline content).
 */
async function broadcastStoreMessage(account: ETHAccount, storageHash: string): Promise<string> {
  const timestamp = Date.now() / 1000;

  // Build the StoreContent JSON exactly as the successful January 2026
  // STOREs did: no payment field, no extra_fields, just address/item_type/
  // item_hash/time.  JSON.stringify with no spaces to match the SDK's
  // sha256(JSON.stringify(content)) hashing.
  const storeContent = JSON.stringify({
    address: account.address,
    item_type: ItemType.storage,
    item_hash: storageHash,
    time: timestamp,
  });

  // Compute item_hash of the inline message (sha256 of the content string).
  const itemHash = createHash('sha256').update(storeContent).digest('hex');

  // Build the broadcastable message object.
  const chain = Blockchain.ETH;
  const type = MessageType.store;
  const sender = account.address;
  const message = {
    chain,
    sender,
    type,
    item_type: ItemType.inline,
    item_hash: itemHash,
    item_content: storeContent,
    channel: CONFIG.ALEPH_CHANNEL,
    time: timestamp,
    // Implement SignableMessage interface required by account.sign():
    // getVerificationBuffer() returns Buffer.from([chain, sender, type, item_hash].join('\n'))
    getVerificationBuffer: () => Buffer.from([chain, sender, type, itemHash].join('\n')),
  };

  // Sign the message using the ETH account's sign() method.
  const signature = await account.sign(message);

  // Broadcast via /api/v0/messages (no balance check for STORE on this endpoint).
  const url = `${alephApiServer}/api/v0/messages`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sync: true,
      message: {
        chain: message.chain,
        sender: message.sender,
        type: message.type,
        item_type: message.item_type,
        item_hash: message.item_hash,
        item_content: message.item_content,
        channel: message.channel,
        time: message.time,
        signature,
      },
    }),
  });

  if (!response.ok && response.status !== 202) {
    const body = await response.text().catch(() => '<no body>');
    throw new Error(`Aleph /api/v0/messages failed (${response.status}): ${body.slice(0, 400)}`);
  }

  return itemHash;
}

/**
 * Upload data to Aleph storage. Throws when ALEPH_PRIVATE_KEY is set and
 * the upload fails, so callers (notably the CI workflow) can surface the
 * failure instead of silently downgrading to local pseudo-hashes.
 */
export async function uploadToAleph(data: unknown, filename: string): Promise<AlephUploadResult> {
  const account = initAlephAccount();
  if (!account) {
    return uploadToLocal(data, filename);
  }

  const content = JSON.stringify(data, null, 2);
  try {
    // Step 1: store the raw JSON, get its storage hash.
    const storageHash = await uploadJsonToStorage(content);

    // Step 2: broadcast an authenticated STORE message pointing to that hash.
    const messageHash = await broadcastStoreMessage(account, storageHash);

    // The message item_hash (64-char hex) is what callers (and the workflow
    // hash validator) use to identify this upload.
    console.log(`☁️ Uploaded ${filename} to Aleph: ${messageHash} (storage: ${storageHash})`);
    return { hash: messageHash, success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(`Aleph upload failed for ${filename}: ${msg}`);
  }
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
