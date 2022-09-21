import { resolve, Utils } from '@kiltprotocol/did';
import { DidDocument, DidEncryptionKey, DidUri } from '@kiltprotocol/types';

import { useAsyncValue } from '../useAsyncValue/useAsyncValue';

export function isFullDid(did: DidUri): boolean {
  if (!did) {
    // could be a legacy identity without DID
    return false;
  }
  return Utils.parseDidUri(did).type === 'full';
}

export async function getDidDocument(did: DidUri): Promise<DidDocument> {
  const details = await resolve(did);
  if (!details?.document) {
    throw new Error(`Cannot resolve DID ${did}`);
  }

  return details.document;
}

export function useDidDocument(did: DidUri): DidDocument | undefined {
  return useAsyncValue(getDidDocument, [did]);
}

export function parseDidUri(did: DidUri): ReturnType<
  typeof Utils.parseDidUri
> & {
  lightDid: DidUri;
  fullDid: DidUri;
} {
  const parsed = Utils.parseDidUri(did);
  const { address, type } = parsed;

  const lightDid =
    type === 'light' ? did : (`did:kilt:light:00${address}` as DidUri);

  const fullDid = type === 'full' ? did : Utils.getFullDidUri(did);

  return {
    ...parsed,
    lightDid,
    fullDid,
  };
}

export function getDidEncryptionKey(document: DidDocument): DidEncryptionKey {
  const { keyAgreement } = document;
  if (!keyAgreement?.length) {
    throw new Error('encryptionKey is not defined somehow');
  }
  return keyAgreement[0];
}
