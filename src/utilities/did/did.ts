import {
  DidDetails,
  Utils,
  FullDidDetails,
  LightDidDetails,
} from '@kiltprotocol/did';
import { DidEncryptionKey, DidUri } from '@kiltprotocol/types';
import { Crypto } from '@kiltprotocol/utils';

import { useAsyncValue } from '../useAsyncValue/useAsyncValue';

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

export function useFullDidDetails(did: DidUri): FullDidDetails | undefined {
  return useAsyncValue(getFullDidDetails, [did]);
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

export function parseDidUri(did: DidUri): ReturnType<
  typeof Utils.parseDidUri
> & {
  lightDid: DidUri;
  fullDid: DidUri;
} {
  const parsed = Utils.parseDidUri(did);
  const { identifier, type } = parsed;
  const unprefixedIdentifier = identifier.replace(/^00/, '');
  const prefixedIdentifier = '00' + identifier;

  const lightDid =
    type === 'light'
      ? did
      : Utils.getKiltDidFromIdentifier(prefixedIdentifier, 'light');

  const fullDid =
    type === 'full'
      ? did
      : Utils.getKiltDidFromIdentifier(unprefixedIdentifier, 'full');

  return {
    ...parsed,
    lightDid,
    fullDid,
  };
}

export function sameFullDid(a: DidUri, b: DidUri): boolean {
  if (!a || !b) {
    return false;
  }
  return parseDidUri(a).fullDid === parseDidUri(b).fullDid;
}

export async function needLegacyDidCrypto(did: DidUri): Promise<boolean> {
  if (!isFullDid(did)) {
    return false;
  }

  try {
    const encryptionKey = getDidEncryptionKey(await getDidDetails(did));
    return (
      Crypto.u8aToHex(encryptionKey.publicKey) ===
      '0xf2c90875e0630bd1700412341e5e9339a57d2fefdbba08de1cac8db5b4145f6e'
    );
  } catch {
    // getDidDetails might throw if the DID is not on-chain anymore (removed, another endpoint),
    // no legacy crypto needed in that case
    return false;
  }
}
