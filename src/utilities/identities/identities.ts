import type {
  Did,
  DidDocument,
  DidUrl,
  KiltAddress,
  KiltEncryptionKeypair,
  KiltKeyringPair,
  SignerInterface,
} from '@kiltprotocol/types';
import type {
  EncryptRequestData,
  IEncryptedMessage,
  MessageBody,
} from '@kiltprotocol/extension-api/types';

import { useContext } from 'react';
import { mutate } from 'swr';
import {
  blake2AsU8a,
  keyExtractPath,
  keyFromPath,
  mnemonicToMiniSecret,
  sr25519PairFromSeed,
} from '@polkadot/util-crypto';
import { find, map, max, memoize } from 'lodash-es';

import { DidResolver } from '@kiltprotocol/sdk-js';
import { Crypto, Signers } from '@kiltprotocol/utils';
import { createLightDidDocument, getFullDid, parse } from '@kiltprotocol/did';
import * as Message from '@kiltprotocol/extension-api/messaging';

import {
  loadEncrypted,
  saveEncrypted,
} from '../storageEncryption/storageEncryption';

import {
  getDidDocument,
  getDidEncryptionKey,
  isFullDid,
  parseDidUri,
} from '../did/did';
import { storage } from '../storage/storage';
import { useSwrDataOrThrow } from '../useSwrDataOrThrow/useSwrDataOrThrow';

import { IdentitiesContext, IdentitiesContextType } from './IdentitiesContext';
import { getIdentities, IDENTITIES_KEY } from './getIdentities';

import { Identity } from './types';

export { Identity, IdentitiesMap } from './types';

const CURRENT_IDENTITY_KEY = 'currentIdentity';

export const NEW: Identity = {
  address: 'NEW' as KiltAddress,
  did: '' as Did,
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

export async function setCurrentIdentityByDid(did?: Did): Promise<void> {
  if (!did) {
    return;
  }
  const identities = await getIdentities();
  const match = find(identities, { did });
  if (!match) {
    return;
  }
  await setCurrentIdentity(match.address);
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

interface IdentityDidCrypto {
  didDocument: DidDocument;
  keypair: KiltKeyringPair;
  authenticationKey: KiltKeyringPair;
  encryptionKey: KiltEncryptionKeypair;
  signers: SignerInterface[];
  encrypt: (
    messageBody: MessageBody,
    dAppDidDocument: DidDocument,
  ) => Promise<IEncryptedMessage>;
}

export function deriveAuthenticationKey(seed: Uint8Array) {
  const baseKey = Crypto.makeKeypairFromSeed(seed, 'sr25519');
  return baseKey.derive('//did//0') as typeof baseKey;
}

export function deriveEncryptionKeyFromSeed(
  seed: Uint8Array,
): KiltEncryptionKeypair {
  const keypair = sr25519PairFromSeed(seed);
  const { path } = keyExtractPath('//did//keyAgreement//0');
  const { secretKey } = keyFromPath(keypair, path, 'sr25519');
  return Crypto.makeEncryptionKeypairFromSeed(blake2AsU8a(secretKey));
}

export function deriveAttestationKeyFromSeed(seed: Uint8Array) {
  const baseKey = Crypto.makeKeypairFromSeed(seed, 'sr25519');
  return baseKey.derive('//did//assertion//0') as typeof baseKey;
}

async function fixLightDidIssues(seed: Uint8Array) {
  const identities = await getIdentities();
  const { address } = Crypto.makeKeypairFromSeed(seed, 'sr25519');
  const identity = identities[address];

  if (!identity) {
    // could be the Alice identity
    return;
  }

  const parsed = identity.did && parse(identity.did);
  if (parsed && parsed.type !== 'light') {
    return;
  }

  try {
    if (!identity.did) {
      // DID was deactivated, no action needed.
      return;
    }

    // If this light DID was created and stored using SDK@0.24.0 then its keys are serialized using base64,
    // resulting in an invalid URI, so resolving would throw an exception.
    const document = await getDidDocument(identity.did);

    // Another issue we see is the light DIDs without key agreement keys, need to regenerate them as well
    getDidEncryptionKey(document);
  } catch {
    // We re-create the invalid DID from scratch and update its URI in the identity.
    const { id } = getLightDidFromSeed(seed);
    await saveIdentity({ ...identity, did: id });
  }
}

export async function getIdentityCryptoFromSeed(
  seed: Uint8Array,
): Promise<IdentityDidCrypto> {
  await fixLightDidIssues(seed);
  const keypair = Crypto.makeKeypairFromSeed(seed, 'sr25519');

  const authenticationKey = deriveAuthenticationKey(seed);
  const encryptionKey = deriveEncryptionKeyFromSeed(seed);

  const identities = await getIdentities();
  const did = getIdentityDid(identities[keypair.address]);

  const didDocument = await getDidDocument(did);

  // id must be an address for light DIDs - passing the light DID key URL does not work
  const signers = await Signers.getSignersForKeypair({
    keypair: authenticationKey,
    id: isFullDid(did)
      ? `${didDocument.id}${didDocument.authentication?.[0]}`
      : authenticationKey.address,
  });

  const keyUri =
    `${didDocument.id}${getDidEncryptionKey(didDocument)}` as DidUrl;

  async function encryptCallback({ data, peerPublicKey }: EncryptRequestData) {
    const { box, nonce } = Crypto.encryptAsymmetric(
      data,
      peerPublicKey,
      encryptionKey.secretKey,
    );

    return {
      nonce,
      data: box,
      keyUri,
    };
  }

  async function encrypt(
    messageBody: MessageBody,
    dAppDidDocument: DidDocument,
  ): Promise<IEncryptedMessage> {
    const message = Message.fromBody(
      messageBody,
      didDocument.id,
      dAppDidDocument.id,
    );

    return Message.encrypt(
      message,
      encryptCallback,
      `${dAppDidDocument.id}${getDidEncryptionKey(dAppDidDocument)}`,
    );
  }

  return {
    didDocument,
    keypair,
    authenticationKey,
    encryptionKey,
    signers,
    encrypt,
  };
}

export async function encryptIdentity(
  backupPhrase: string,
  password: string,
): Promise<KiltAddress> {
  const seed = mnemonicToMiniSecret(backupPhrase);
  const { address } = Crypto.makeKeypairFromUri(backupPhrase, 'sr25519');
  await saveEncrypted(address, password, seed);
  return address;
}

export function getLightDidFromSeed(seed: Uint8Array): DidDocument {
  return createLightDidDocument({
    authentication: [deriveAuthenticationKey(seed)],
    keyAgreement: [deriveEncryptionKeyFromSeed(seed)],
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

  const { id } = getLightDidFromSeed(seed);

  const { name, index } = await getIdentityName();

  const identity = { name, address, did: id, index };
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
  const lightDid = lightDidDocument.id;

  const {
    didDocumentMetadata: { canonicalId, deactivated },
  } = await DidResolver.resolve(lightDid, {});

  const fullDid = canonicalId;

  const did = deactivated ? undefined : fullDid || lightDid;
  const deletedDid = deactivated ? getFullDid(lightDid) : undefined;

  const { name, index } = await getIdentityName();

  const identity = {
    name,
    address,
    index,
    ...(!deactivated && { did }),
    ...(deactivated && { deletedDid }),
  };
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

  if (!identity.did) {
    // maybe the DID was deleted from the blockchain
    return;
  }

  const { fullDid, type } = parseDidUri(identity.did);
  const wasOnChain = type === 'full';

  const {
    didDocument,
    didDocumentMetadata: { canonicalId, deactivated },
  } = await DidResolver.resolve(identity.did, {});

  const isOnChain = wasOnChain
    ? Boolean(didDocument && !deactivated)
    : Boolean(didDocument && canonicalId);

  if (wasOnChain && !isOnChain) {
    await saveIdentity({
      ...identity,
      did: undefined,
      deletedDid: fullDid,
    });
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

export function getIdentityDid({ did }: Identity): Did {
  if (!did) {
    throw new Error('DID is deleted and unusable');
  }
  return did;
}
