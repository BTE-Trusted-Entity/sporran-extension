import {
  DidDetails,
  DidUtils,
  FullDidDetails,
  LightDidDetails,
} from '@kiltprotocol/did';
import {
  DidEncryptionKey,
  DidServiceEndpoint,
  IDidDetails,
} from '@kiltprotocol/types';
import { Crypto } from '@kiltprotocol/utils';

export function isFullDid(did: IDidDetails['did']): boolean {
  if (!did) {
    // could be a legacy identity without DID
    return false;
  }
  return DidUtils.parseDidUri(did).type === 'full';
}

export async function getFullDidDetails(
  did: IDidDetails['did'],
): Promise<FullDidDetails> {
  const { identifier } = DidUtils.parseDidUri(did);

  const details = await FullDidDetails.fromChainInfo(identifier);
  if (!details) {
    throw new Error(`Cannot resolve DID ${did}`);
  }

  return details;
}

export async function getDidDetails(
  did: IDidDetails['did'],
): Promise<DidDetails> {
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

export function getFragment(id: DidServiceEndpoint['id']): string {
  if (!id.includes('#')) {
    return id;
  }
  return DidUtils.parseDidUri(id).fragment as string;
}

export function parseDidUri(did: IDidDetails['did']): ReturnType<
  typeof DidUtils.parseDidUri
> & {
  lightDid: IDidDetails['did'];
  fullDid: IDidDetails['did'];
} {
  const parsed = DidUtils.parseDidUri(did);
  const { identifier, type } = parsed;
  const unprefixedIdentifier = identifier.replace(/^00/, '');
  const prefixedIdentifier = '00' + identifier;

  const lightDid =
    type === 'light'
      ? did
      : DidUtils.getKiltDidFromIdentifier(prefixedIdentifier, 'light');

  const fullDid =
    type === 'full'
      ? did
      : DidUtils.getKiltDidFromIdentifier(unprefixedIdentifier, 'full');

  return {
    ...parsed,
    lightDid,
    fullDid,
  };
}

export function sameFullDid(
  a: IDidDetails['did'],
  b: IDidDetails['did'],
): boolean {
  if (!a || !b) {
    return false;
  }
  return parseDidUri(a).fullDid === parseDidUri(b).fullDid;
}

export async function needLegacyDidCrypto(did: string): Promise<boolean> {
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
