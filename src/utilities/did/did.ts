import { resolve, Utils } from '@kiltprotocol/did';
import { DidDocument, DidEncryptionKey, DidUri } from '@kiltprotocol/types';

export function isFullDid(did?: DidUri): boolean {
  if (!did) {
    // Will be undefined if DID has been removed from chain
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

export function parseDidUri(did: DidUri): ReturnType<
  typeof Utils.parseDidUri
> & {
  fullDid: DidUri;
} {
  const parsed = Utils.parseDidUri(did);
  const { type } = parsed;

  const fullDid = type === 'full' ? did : Utils.getFullDidUri(did);

  return {
    ...parsed,
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
