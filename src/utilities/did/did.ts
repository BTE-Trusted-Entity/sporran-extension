import {
  ConfigService,
  Did,
  DidDocument,
  DidEncryptionKey,
  DidUri,
} from '@kiltprotocol/sdk-js';

import { useAsyncValue } from '../useAsyncValue/useAsyncValue';

export function isFullDid(did: DidUri | undefined): boolean {
  if (!did) {
    // maybe the DID was deleted from the blockchain
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
