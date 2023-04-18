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
  Did,
  DidDocument,
  DidResourceUri,
  DidUri,
  EncryptRequestData,
  IEncryptedMessage,
  KiltAddress,
  KiltEncryptionKeypair,
  KiltKeyringPair,
  Message,
  MessageBody,
  SignCallback,
  SignRequestData,
  Utils,
} from '@kiltprotocol/sdk-js';
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

export async function getCurrentIdentity(): Promise<string | null> {
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

export function deriveAuthenticationKey(seed: Uint8Array) {
  const baseKey = Utils.Crypto.makeKeypairFromSeed(seed, 'sr25519');
  return baseKey.derive('//did//0') as typeof baseKey;
}

export function deriveEncryptionKeyFromSeed(
  seed: Uint8Array,
): KiltEncryptionKeypair {
  const keypair = sr25519PairFromSeed(seed);
  const { path } = keyExtractPath('//did//keyAgreement//0');
  const { secretKey } = keyFromPath(keypair, path, 'sr25519');
  return Utils.Crypto.makeEncryptionKeypairFromSeed(blake2AsU8a(secretKey));
}

export function deriveAttestationKeyFromSeed(seed: Uint8Array) {
  const baseKey = Utils.Crypto.makeKeypairFromSeed(seed, 'sr25519');
  return baseKey.derive('//did//assertion//0') as typeof baseKey;
}

function deriveEncryptionKeyLegacy(seed: Uint8Array) {
  const keypair = Utils.Crypto.makeKeypairFromSeed(seed, 'sr25519');
  const encryptionKeyringPair = keypair.derive('//did//keyAgreement//0');

  const secret = encryptionKeyringPair
    .encryptMessage(
      new Uint8Array(24).fill(0),
      new Uint8Array(24).fill(0),
      new Uint8Array(24).fill(0),
    )
    .slice(24); // first 24 bytes are the nonce

  return Utils.Crypto.makeEncryptionKeypairFromSeed(secret);
}

async function fixLightDidIssues(seed: Uint8Array) {
  const identities = await getIdentities();
  const { address } = Utils.Crypto.makeKeypairFromSeed(seed, 'sr25519');
  const identity = identities[address];

  if (!identity) {
    // could be the Alice identity
    return;
  }

  const parsed = identity.did && Did.parse(identity.did);
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
    const encryptionKey = getDidEncryptionKey(document);

    // This public key also means the DID needs to be regenerated
    const troubleKey =
      '0xf2c90875e0630bd1700412341e5e9339a57d2fefdbba08de1cac8db5b4145f6e';
    if (Utils.Crypto.u8aToHex(encryptionKey.publicKey) === troubleKey) {
      throw new Error();
    }
  } catch {
    // We re-create the invalid DID from scratch and update its URI in the identity.
    const { uri } = getLightDidFromSeed(seed);
    await saveIdentity({ ...identity, did: uri });
  }
}

export async function getIdentityCryptoFromSeed(
  seed: Uint8Array,
  legacy?: boolean,
): Promise<IdentityDidCrypto> {
  await fixLightDidIssues(seed);

  const authenticationKey = deriveAuthenticationKey(seed);
  const encryptionKey = legacy
    ? deriveEncryptionKeyLegacy(seed)
    : deriveEncryptionKeyFromSeed(seed);

  const keypair = Utils.Crypto.makeKeypairFromSeed(seed, 'sr25519');
  const identities = await getIdentities();
  const did = getIdentityDid(identities[keypair.address]);

  const didDocument = await getDidDocument(did);

  async function encryptCallback({ data, peerPublicKey }: EncryptRequestData) {
    const { box, nonce } = Utils.Crypto.encryptAsymmetric(
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
  const { address } = Utils.Crypto.makeKeypairFromUri(backupPhrase, 'sr25519');
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
async function syncDidStateWithBlockchain(address: string | null | undefined) {
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
