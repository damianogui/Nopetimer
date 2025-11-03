// Ensure a Web Crypto-compatible `crypto.getRandomValues` exists before Vite loads.
// This file is required with `node -r ./scripts/crypto-polyfill.cjs` from package.json.
try {
  if (!globalThis.crypto) {
    const { webcrypto } = require('node:crypto');
    if (webcrypto && typeof webcrypto.getRandomValues === 'function') {
      globalThis.crypto = webcrypto;
    } else {
      const { randomFillSync } = require('node:crypto');
      globalThis.crypto = {
        getRandomValues: (arr) => randomFillSync(arr)
      };
    }
  } else if (globalThis.crypto && typeof globalThis.crypto.getRandomValues !== 'function') {
    const { randomFillSync } = require('node:crypto');
    globalThis.crypto.getRandomValues = (arr) => randomFillSync(arr);
  }
} catch (e) {
  // Minimal fallback: define a getRandomValues using randomFillSync
  try {
    const { randomFillSync } = require('node:crypto');
    globalThis.crypto = globalThis.crypto || {};
    globalThis.crypto.getRandomValues = (arr) => randomFillSync(arr);
  } catch (err) {
    // If even this fails, leave it - Vite will likely fail later with a clear error.
  }
}
