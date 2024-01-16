import {
  Did,
  DidDocument,
  KiltKeyringPair,
  UriFragment,
  VerificationMethod,
} from '@kiltprotocol/types';

import { DidResolver } from '@kiltprotocol/sdk-js';
import {
  didKeyToVerificationMethod,
  getFullDid,
  parse,
  parseDocumentFromLightDid,
} from '@kiltprotocol/did';

import { blake2AsHex } from '@polkadot/util-crypto';

import { useAsyncValue } from '../useAsyncValue/useAsyncValue';

export function isFullDid(did: Did | undefined): boolean {
  if (!did) {
    // maybe the DID was deleted from the blockchain
    return false;
  }
  return parse(did).type === 'full';
}

export async function getFullDidDocument(did: Did): Promise<DidDocument> {
  const { didDocument } = await DidResolver.resolve(did, {});
  if (!didDocument) {
    throw new Error('Unable to resolve DID');
  }
  return didDocument;
}

export function useFullDidDocument(did: Did): DidDocument | undefined {
  return useAsyncValue(getFullDidDocument, [did]);
}

export async function getDidDocument(did: Did): Promise<DidDocument> {
  return isFullDid(did)
    ? await getFullDidDocument(did)
    : parseDocumentFromLightDid(did);
}

export function getDidEncryptionKey({
  keyAgreement,
}: DidDocument): UriFragment {
  if (!keyAgreement || !keyAgreement[0]) {
    throw new Error('encryptionKey is not defined somehow');
  }
  return keyAgreement[0];
}

export function parseDidUri(did: Did): ReturnType<typeof parse> & {
  fullDid: Did;
} {
  const parsed = parse(did);
  const fullDid = parsed.type === 'full' ? did : getFullDid(did);

  return {
    ...parsed,
    fullDid,
  };
}

export function computeKeyId(key: Uint8Array): VerificationMethod['id'] {
  return `#${blake2AsHex(key, 256)}`;
}

export function verificationMethodFromKeypair(
  { publicKey, type }: KiltKeyringPair,
  controller: Did,
): VerificationMethod {
  return didKeyToVerificationMethod(controller, computeKeyId(publicKey), {
    keyType: type,
    publicKey,
  });
}
