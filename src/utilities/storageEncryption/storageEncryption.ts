import browser from 'webextension-polyfill';

type SaltsAndCipherBytes = {
  keySaltBytes: ArrayBuffer;
  cipherSaltBytes: ArrayBuffer;
  cipherBytes: ArrayBuffer;
};

type SaltsAndCipherStrings = {
  keySaltString: string;
  cipherSaltString: string;
  cipherString: string;
};

export class PasswordError extends Error {}

async function deriveKeyFromPassword(
  password: string,
  keySaltBytes: ArrayBuffer,
): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveKey'],
  );

  // https://kiltprotocol.atlassian.net/wiki/spaces/SKA/pages/1985478657/Research+How+to+secure+browser+extension
  // https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#pbkdf2
  const iterations = 200_000;

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: keySaltBytes,
      iterations,
      hash: 'SHA-512',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

export async function encrypt(
  password: string,
  bytes: Uint8Array,
): Promise<SaltsAndCipherBytes> {
  const keySaltBytes = crypto.getRandomValues(new Uint8Array(16));
  const cipherSaltBytes = crypto.getRandomValues(new Uint8Array(16));

  const key = await deriveKeyFromPassword(password, keySaltBytes);

  const cipherBytes = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: cipherSaltBytes },
    key,
    bytes,
  );

  return {
    keySaltBytes,
    cipherSaltBytes,
    cipherBytes,
  };
}

export async function decrypt(
  password: string,
  bytes: SaltsAndCipherBytes,
): Promise<ArrayBuffer> {
  const { keySaltBytes, cipherSaltBytes, cipherBytes } = bytes;
  const key = await deriveKeyFromPassword(password, keySaltBytes);

  try {
    return await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: cipherSaltBytes },
      key,
      cipherBytes,
    );
  } catch {
    throw new PasswordError('Invalid password');
  }
}

function arrayBufferToBase64(arrayBuffer: ArrayBuffer): string {
  const bytes = new Uint8Array(arrayBuffer);
  const asciiString = String.fromCodePoint(...bytes);
  return window.btoa(asciiString);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const asciiString = window.atob(base64);
  return Uint8Array.from(asciiString, (c) => c.charCodeAt(0)).buffer;
}

function serializeEncrypted({
  keySaltBytes,
  cipherSaltBytes,
  cipherBytes,
}: SaltsAndCipherBytes): SaltsAndCipherStrings {
  return {
    keySaltString: arrayBufferToBase64(keySaltBytes),
    cipherSaltString: arrayBufferToBase64(cipherSaltBytes),
    cipherString: arrayBufferToBase64(cipherBytes),
  };
}

function deserializeEncrypted({
  keySaltString,
  cipherSaltString,
  cipherString,
}: SaltsAndCipherStrings): SaltsAndCipherBytes {
  return {
    keySaltBytes: base64ToArrayBuffer(keySaltString),
    cipherSaltBytes: base64ToArrayBuffer(cipherSaltString),
    cipherBytes: base64ToArrayBuffer(cipherString),
  };
}

const storage = browser.storage.local;

export async function saveEncrypted(
  storageKey: string,
  password: string,
  bytes: Uint8Array,
): Promise<void> {
  const result = await encrypt(password, bytes);
  const serialized = serializeEncrypted(result);
  await storage.set({ [storageKey]: serialized });
}

export async function loadEncrypted(
  storageKey: string,
  password: string,
): Promise<ArrayBuffer> {
  const stored = await storage.get(storageKey);
  const serialized = stored[storageKey] as SaltsAndCipherStrings;
  const bytes = deserializeEncrypted(serialized);
  return decrypt(password, bytes);
}
