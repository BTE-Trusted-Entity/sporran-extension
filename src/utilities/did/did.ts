import type { Did, DidDocument, UriFragment } from '@kiltprotocol/types';

import { DidResolver } from '@kiltprotocol/sdk-js';
import {
  getFullDid,
  parse,
  parseDocumentFromLightDid,
} from '@kiltprotocol/did';

import { useAsyncValue } from '../useAsyncValue/useAsyncValue';

export function isFullDid(did: Did | undefined): boolean {
  if (!did) {
    // maybe the DID was deleted from the blockchain
    return false;
  }
  return parse(did).type === 'full';
}

export async function getFullDidDocument(did: Did): Promise<DidDocument> {
  const {
    didDocument,
    didResolutionMetadata: { error },
  } = await DidResolver.resolve(did, {});
  if (!didDocument) {
    throw new Error(`DID resolution error: ${error}`);
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
