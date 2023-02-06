import { useContext } from 'react';
import { mutate } from 'swr';
import {
  blake2AsU8a,
  keyExtractPath,
  keyFromPath,
  mnemonicToMiniSecret,
  sr25519PairFromSeed,
} from '@polkadot/util-crypto';
import {
  DidDocument,
  DidResourceUri,
  DidUri,
  EncryptRequestData,
  IEncryptedMessage,
  KiltAddress,
  KiltEncryptionKeypair,
  KiltKeyringPair,
  MessageBody,
  SignCallback,
  SignRequestData,
} from '@kiltprotocol/types';
import * as Message from '@kiltprotocol/messaging';
import * as Did from '@kiltprotocol/did';
import { Crypto } from '@kiltprotocol/utils';
import { map, max, memoize } from 'lodash-es';

import {
  loadEncrypted,
  saveEncrypted,
} from '../storageEncryption/storageEncryption';

import { getDidDocument, getDidEncryptionKey, parseDidUri } from '../did/did';
import { storage } from '../storage/storage';
import { useSwrDataOrThrow } from '../useSwrDataOrThrow/useSwrDataOrThrow';

import { IdentitiesContext, IdentitiesContextType } from './IdentitiesContext';
import { getIdentities, IDENTITIES_KEY } from './getIdentities';

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

interface IdentityDidCrypto {
  didDocument: DidDocument;
  keypair: KiltKeyringPair;
  authenticationKey: KiltKeyringPair;
  sign: SignCallback;
  encrypt: (
    messageBody: MessageBody,
    dAppDidDocument: DidDocument,
  ) => Promise<IEncryptedMessage>;
}

function deriveAuthenticationKey(seed: Uint8Array) {
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

export async function getIdentityCryptoFromSeed(
  seed: Uint8Array,
): Promise<IdentityDidCrypto> {
  const authenticationKey = deriveAuthenticationKey(seed);
  const encryptionKey = deriveEncryptionKeyFromSeed(seed);

  const keypair = Crypto.makeKeypairFromSeed(seed, 'sr25519');
  const identities = await getIdentities();
  const did = getIdentityDid(identities[keypair.address]);

  const didDocument = await getDidDocument(did);

  async function encryptCallback({ data, peerPublicKey }: EncryptRequestData) {
    const { box, nonce } = Crypto.encryptAsymmetric(
      data,
      peerPublicKey,
      encryptionKey.secretKey,
    );
    const keyUri = `${didDocument.uri}${getDidEncryptionKey(didDocument).id}`;
    return {
      nonce,
      data: box,
      keyUri: keyUri as DidResourceUri,
    };
  }

  async function sign({ data, keyRelationship }: SignRequestData) {
    if (keyRelationship !== 'authentication') {
      throw new Error(
        'Only key relationship "authentication" is supported for signing',
      );
    }

    const signature = authenticationKey.sign(data, { withType: false });
    const keyUri =
      `${didDocument.uri}${didDocument.authentication[0].id}` as DidResourceUri;
    const keyType = authenticationKey.type;

    return {
      signature,
      keyUri,
      keyType,
    };
  }

  async function encrypt(
    messageBody: MessageBody,
    dAppDidDocument: DidDocument,
  ): Promise<IEncryptedMessage> {
    const message = Message.fromBody(
      messageBody,
      didDocument.uri,
      dAppDidDocument.uri,
    );

    return Message.encrypt(
      message,
      encryptCallback,
      `${dAppDidDocument.uri}${getDidEncryptionKey(dAppDidDocument).id}`,
    );
  }

  return {
    didDocument,
    keypair,
    authenticationKey,
    sign,
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
  return Did.createLightDidDocument({
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
  const lightDid = lightDidDocument.uri;

  const resolved = await Did.resolve(lightDid);
  const fullDid = resolved?.metadata?.canonicalId;

  const deactivated = resolved?.metadata?.deactivated;
  const did = deactivated ? undefined : fullDid || lightDid;
  const deletedDid = deactivated ? Did.getFullDidUri(lightDid) : undefined;

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
export async function syncDidStateWithBlockchain(
  address: string | null | undefined,
) {
  if (!address) {
    return;
  }

  const identities = await getIdentities();
  const identity = identities[address];

  if (!identity.did) {
    // could be a legacy identity without DID
    return;
  }

  const { fullDid, type } = parseDidUri(identity.did);
  const wasOnChain = type === 'full';

  const resolved = await Did.resolve(identity.did);
  const isOnChain = wasOnChain
    ? Boolean(resolved && resolved.metadata && !resolved.metadata.deactivated)
    : Boolean(resolved && resolved.metadata && resolved.metadata.canonicalId);

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

export function getIdentityDid({ did }: Identity): DidUri {
  if (!did) {
    throw new Error('DID is deleted and unusable');
  }
  return did;
}
