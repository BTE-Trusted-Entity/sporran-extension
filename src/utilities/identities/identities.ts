import { useContext } from 'react';
import { mutate } from 'swr';
import { Keyring } from '@polkadot/keyring';
import { HexString } from '@polkadot/util/types';
import {
  naclBoxPairFromSecret,
  naclSeal,
  mnemonicToMiniSecret,
  blake2AsU8a,
  keyFromPath,
  keyExtractPath,
  sr25519PairFromSeed,
} from '@polkadot/util-crypto';
import {
  EncryptionKeyType,
  IEncryptedMessage,
  MessageBody,
  DidUri,
  DidResourceUri,
  SignCallback,
  EncryptCallback,
  DidDocument,
  KiltAddress,
  KiltKeyringPair,
  SignRequestData,
  SignResponseData,
} from '@kiltprotocol/types';
import * as Message from '@kiltprotocol/messaging';
import { Crypto } from '@kiltprotocol/utils';
import { createLightDidDocument, resolve } from '@kiltprotocol/did';
import { map, max, memoize } from 'lodash-es';

import {
  loadEncrypted,
  saveEncrypted,
} from '../storageEncryption/storageEncryption';

import { getDidDocument, getDidEncryptionKey, parseDidUri } from '../did/did';
import { storage } from '../storage/storage';
import { useSwrDataOrThrow } from '../useSwrDataOrThrow/useSwrDataOrThrow';

import { IdentitiesContext, IdentitiesContextType } from './IdentitiesContext';
import { IDENTITIES_KEY, getIdentities } from './getIdentities';

import { Identity } from './types';
export { Identity, IdentitiesMap } from './types';

const CURRENT_IDENTITY_KEY = 'currentIdentity';

export const NEW: Identity = {
  address: 'NEW' as KiltAddress,
  did: '' as DidUri,
  name: '',
  index: -1,
};

export function isNew(identity: Identity): boolean {
  return identity === NEW;
}

export function useIdentities(): IdentitiesContextType {
  return useContext(IdentitiesContext);
}

async function getCurrentIdentity(): Promise<string | null> {
  const identities = await getIdentities();
  const stored = await storage.get(CURRENT_IDENTITY_KEY);
  const current = stored[CURRENT_IDENTITY_KEY];

  if (identities[current]) {
    return current;
  }

  const firstIdentity = Object.values(identities)[0];
  if (!firstIdentity) {
    return null;
  }

  await setCurrentIdentity(firstIdentity.address);

  return firstIdentity.address;
}

export async function setCurrentIdentity(address: string): Promise<void> {
  const oldAddress = await storage.get(CURRENT_IDENTITY_KEY);
  if (address === oldAddress[CURRENT_IDENTITY_KEY]) {
    return;
  }
  await storage.set({ [CURRENT_IDENTITY_KEY]: address });
  await mutate(['getCurrentIdentity', CURRENT_IDENTITY_KEY]);
}

export async function saveIdentity(identity: Identity): Promise<void> {
  const identities = await getIdentities();
  identities[identity.address] = identity;
  await storage.set({ [IDENTITIES_KEY]: identities });
  await mutate(IDENTITIES_KEY);
}

export async function removeIdentity(identity: Identity): Promise<void> {
  const identities = await getIdentities();
  delete identities[identity.address];

  await storage.set({ [IDENTITIES_KEY]: identities });
  await storage.remove(identity.address);

  const firstIdentity = Object.values(identities)[0];
  await setCurrentIdentity(firstIdentity?.address);

  await mutate(IDENTITIES_KEY);
}

// KILT has registered the ss58 prefix 38
const ss58Format = 38;

export function makeKeyring(): Keyring {
  return new Keyring({
    type: 'sr25519',
    ss58Format,
  });
}

export function getKeypairByBackupPhrase(
  backupPhrase: string,
): KiltKeyringPair {
  return makeKeyring().addFromUri(backupPhrase) as KiltKeyringPair;
}

export function getKeypairBySeed(seed: Uint8Array): KiltKeyringPair {
  return makeKeyring().addFromSeed(seed) as KiltKeyringPair;
}

// Why doesn't the SDK export this type? SignCallback is not sufficient for Did.Chain.GetStoreTx
declare type GetStoreTxSignCallback = (
  signData: Omit<SignRequestData, 'did'>,
) => Promise<Omit<SignResponseData, 'keyUri'>>;

interface IdentityDidCrypto {
  didDocument: DidDocument;
  sign: SignCallback;
  encrypt: EncryptCallback;
  signGetStoreTx: GetStoreTxSignCallback;
  signStr: (plaintext: string) => {
    signature: HexString;
    didKeyUri: DidResourceUri;
  };
  encryptMsg: (
    messageBody: MessageBody,
    dAppDidDocument: DidDocument,
  ) => Promise<IEncryptedMessage>;
}

function deriveAuthenticationKey(seed: Uint8Array): KiltKeyringPair {
  return getKeypairBySeed(seed).derive('//did//0') as KiltKeyringPair;
}

export function deriveEncryptionKeyFromSeed(seed: Uint8Array): {
  type: EncryptionKeyType;
  publicKey: Uint8Array;
  secretKey: Uint8Array;
} {
  const keypair = sr25519PairFromSeed(seed);
  const { path } = keyExtractPath('//did//keyAgreement//0');
  const { secretKey } = keyFromPath(keypair, path, 'sr25519');
  return {
    ...naclBoxPairFromSecret(blake2AsU8a(secretKey)),
    type: 'x25519',
  };
}

export async function getIdentityCryptoFromSeed(
  seed: Uint8Array,
): Promise<IdentityDidCrypto> {
  const authenticationKey = deriveAuthenticationKey(seed);
  const encryptionKey = deriveEncryptionKeyFromSeed(seed);

  const { address } = getKeypairBySeed(seed);
  const identities = await getIdentities();
  const { did } = identities[address];

  const didDocument = await getDidDocument(did);
  const { authentication, keyAgreement } = didDocument;

  if (!keyAgreement || !authentication) {
    throw new Error(
      'This DID does not have an authentication or encryption key?',
    );
  }
  const sign: SignCallback = async ({ data }) => ({
    data: authenticationKey.sign(data, { withType: false }),
    keyType: authenticationKey.type,
    keyUri: `${did}${authentication[0].id}`,
  });

  const signGetStoreTx: GetStoreTxSignCallback = async ({ data }) => ({
    data: authenticationKey.sign(data, { withType: false }),
    keyType: authenticationKey.type,
  });

  const encrypt: EncryptCallback = async ({ data, peerPublicKey }) => {
    const { sealed, nonce } = naclSeal(
      data,
      encryptionKey.secretKey,
      peerPublicKey,
    );

    return {
      data: sealed,
      nonce,
      keyUri: `${did}${keyAgreement[0].id}`,
    };
  };

  function signStr(plaintext: string) {
    const signature = Crypto.u8aToHex(authenticationKey.sign(plaintext));

    const didKeyUri: DidResourceUri = `${did}${authentication[0].id}`;

    return { signature, didKeyUri };
  }

  async function encryptMsg(
    messageBody: MessageBody,
    dAppDidDocument: DidDocument,
  ): Promise<IEncryptedMessage> {
    const message = Message.fromBody(messageBody, did, dAppDidDocument.uri);
    return Message.encrypt(
      message,
      encrypt,
      `${dAppDidDocument.uri}${getDidEncryptionKey(dAppDidDocument).id}`,
    );
  }

  return {
    didDocument,
    sign,
    signGetStoreTx,
    encrypt,
    signStr,
    encryptMsg,
  };
}

export async function encryptIdentity(
  backupPhrase: string,
  password: string,
): Promise<KiltAddress> {
  const seed = mnemonicToMiniSecret(backupPhrase);
  const { address } = getKeypairByBackupPhrase(backupPhrase);
  await saveEncrypted(address, password, seed);
  return address as KiltAddress;
}

export function getLightDidFromSeed(seed: Uint8Array): DidDocument {
  const authenticationKey = deriveAuthenticationKey(seed);
  const encryptionKey = deriveEncryptionKeyFromSeed(seed);
  return createLightDidDocument({
    authentication: [
      {
        ...authenticationKey,
        type: 'sr25519',
      },
    ],
    keyAgreement: [encryptionKey],
  });
}

async function getIdentityName(): Promise<{ name: string; index: number }> {
  const identities = await getIdentities();
  const largestIndex = max(map(identities, 'index')) || 0;

  const index = 1 + largestIndex;

  return { name: `KILT Identity ${index}`, index };
}

export async function createIdentity(
  backupPhrase: string,
  password: string,
): Promise<Identity> {
  const address = await encryptIdentity(backupPhrase, password);

  const seed = mnemonicToMiniSecret(backupPhrase);

  const { uri } = getLightDidFromSeed(seed);

  const { name, index } = await getIdentityName();

  const identity = { name, address, did: uri, index };
  await saveIdentity(identity);

  return identity;
}

export async function importIdentity(
  backupPhrase: string,
  password: string,
): Promise<Identity> {
  const address = await encryptIdentity(backupPhrase, password);

  const seed = mnemonicToMiniSecret(backupPhrase);

  const lightDidDocument = getLightDidFromSeed(seed);
  const resolved = await resolve(lightDidDocument.uri);

  const did =
    resolved && resolved.metadata && resolved.metadata.canonicalId
      ? resolved.metadata.canonicalId
      : lightDidDocument.uri;

  const { name, index } = await getIdentityName();

  const identity = { name, address, did, index };
  await saveIdentity(identity);

  return identity;
}

export async function decryptIdentity(
  address: string,
  password: string,
): Promise<Uint8Array> {
  const seed = await loadEncrypted(address, password);
  return new Uint8Array(seed);
}

/** Ensure that local information about the DID type matches stored on blockchain
 * even if an error occurred while asynchronous update was running */
async function syncDidStateWithBlockchain(address: string | null | undefined) {
  if (!address) {
    return;
  }

  const identities = await getIdentities();
  const identity = identities[address];

  const { fullDid, lightDid, type } = parseDidUri(identity.did);
  const wasOnChain = type === 'full';

  const resolved = await resolve(identity.did);
  const isOnChain = wasOnChain
    ? Boolean(resolved && resolved.metadata && !resolved.metadata.deactivated)
    : Boolean(resolved && resolved.metadata && resolved.metadata.canonicalId);

  if (wasOnChain && !isOnChain) {
    await saveIdentity({ ...identity, did: lightDid });
  }

  if (!wasOnChain && isOnChain) {
    await saveIdentity({ ...identity, did: fullDid });
  }
}

/** Memoized function will run only once per identity while the popup is open, do not use from backend */
const noAwaitUpdateCachedDidStateOnce = memoize(syncDidStateWithBlockchain);

export function useCurrentIdentity(): string | null | undefined {
  const data = useSwrDataOrThrow(
    CURRENT_IDENTITY_KEY,
    getCurrentIdentity,
    'getCurrentIdentity',
  );

  noAwaitUpdateCachedDidStateOnce(data);

  return data;
}
