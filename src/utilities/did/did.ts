import {
  DidDetails,
  Utils,
  FullDidDetails,
  LightDidDetails,
} from '@kiltprotocol/did';
import { DidEncryptionKey, DidUri } from '@kiltprotocol/types';

export function isFullDid(did: DidUri): boolean {
  if (!did) {
    // could be a legacy identity without DID
    return false;
  }
  return Utils.parseDidUri(did).type === 'full';
}

export async function getFullDidDetails(did: DidUri): Promise<FullDidDetails> {
  const details = await FullDidDetails.fromChainInfo(did);
  if (!details) {
    throw new Error(`Cannot resolve DID ${did}`);
  }

  return details;
}

export async function getDidDetails(did: DidUri): Promise<DidDetails> {
  return isFullDid(did)
    ? await getFullDidDetails(did)
    : LightDidDetails.fromUri(did);
}

export function getDidEncryptionKey(details: DidDetails): DidEncryptionKey {
  const { encryptionKey } = details;
  if (!encryptionKey) {
    throw new Error('encryptionKey is not defined somehow');
  }
  return encryptionKey;
}
