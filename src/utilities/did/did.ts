import { resolve, Utils } from '@kiltprotocol/did';
import { DidDocument, DidEncryptionKey, DidUri } from '@kiltprotocol/types';

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

export function getDidEncryptionKey(details: DidDocument): DidEncryptionKey {
  const { keyAgreement } = details;
  if (!keyAgreement?.length) {
    throw new Error('encryptionKey is not defined somehow');
  }
  return keyAgreement[0];
}
