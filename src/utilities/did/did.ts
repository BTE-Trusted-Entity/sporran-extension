import { ConfigService } from '@kiltprotocol/config';
import * as Did from '@kiltprotocol/did';
import { DidDocument, DidEncryptionKey, DidUri } from '@kiltprotocol/types';
import { Crypto } from '@kiltprotocol/utils';

import { useAsyncValue } from '../useAsyncValue/useAsyncValue';

export function isFullDid(did: DidUri | undefined): boolean {
  if (!did) {
    // could be a legacy identity without DID
    return false;
  }
  return Did.parse(did).type === 'full';
}

export async function getFullDidDocument(did: DidUri): Promise<DidDocument> {
  const api = ConfigService.get('api');
  return Did.linkedInfoFromChain(await api.call.did.query(Did.toChain(did)))
    .document;
}

export function useFullDidDocument(did: DidUri): DidDocument | undefined {
  return useAsyncValue(getFullDidDocument, [did]);
}

export async function getDidDocument(did: DidUri): Promise<DidDocument> {
  return isFullDid(did)
    ? await getFullDidDocument(did)
    : Did.parseDocumentFromLightDid(did);
}

export function getDidEncryptionKey({
  keyAgreement,
}: DidDocument): DidEncryptionKey {
  if (!keyAgreement || !keyAgreement[0]) {
    throw new Error('encryptionKey is not defined somehow');
  }
  return keyAgreement[0];
}

export function parseDidUri(did: DidUri): ReturnType<typeof Did.parse> & {
  fullDid: DidUri;
} {
  const parsed = Did.parse(did);
  const fullDid = parsed.type === 'full' ? did : Did.getFullDidUri(did);

  return {
    ...parsed,
    fullDid,
  };
}

export async function needLegacyDidCrypto(
  did: DidUri | undefined,
): Promise<boolean> {
  if (!did) {
    // DID was deactivated, no action needed.
    return false;
  }
  if (!isFullDid(did)) {
    return false;
  }

  try {
    const encryptionKey = getDidEncryptionKey(await getDidDocument(did));
    return (
      Crypto.u8aToHex(encryptionKey.publicKey) ===
      '0xf2c90875e0630bd1700412341e5e9339a57d2fefdbba08de1cac8db5b4145f6e'
    );
  } catch {
    // getDidDocument might throw if the DID is not on-chain anymore (removed, another endpoint),
    // no legacy crypto needed in that case
    return false;
  }
}
