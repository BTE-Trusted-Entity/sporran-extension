import { useContext } from 'react';
import { mutate } from 'swr';
import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
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
  DidPublicKey,
  EncryptionKeyType,
  IEncryptedMessage,
  KeystoreSigner,
  MessageBody,
  NaclBoxCapable,
  VerificationKeyType,
} from '@kiltprotocol/types';
import { Message } from '@kiltprotocol/messaging';
import {
  DidDetails,
  DidResolver,
  DidUtils,
  LightDidDetails,
} from '@kiltprotocol/did';
import { Crypto } from '@kiltprotocol/utils';
import { map, max, memoize } from 'lodash-es';

import {
  loadEncrypted,
  saveEncrypted,
} from '../storageEncryption/storageEncryption';

import { getDidDetails, getDidEncryptionKey, parseDidUri } from '../did/did';
import { storage } from '../storage/storage';
import { useSwrDataOrThrow } from '../useSwrDataOrThrow/useSwrDataOrThrow';

import { IdentitiesContext, IdentitiesContextType } from './IdentitiesContext';
import { IDENTITIES_KEY, getIdentities } from './getIdentities';

import { Identity } from './types';

export { Identity, IdentitiesMap } from './types';

const CURRENT_IDENTITY_KEY = 'currentIdentity';

export const NEW: Identity = {
  address: 'NEW',
  did: '',
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

export function getKeypairByBackupPhrase(backupPhrase: string): KeyringPair {
  return makeKeyring().addFromUri(backupPhrase);
}

export function getKeypairBySeed(seed: Uint8Array): KeyringPair {
  return makeKeyring().addFromSeed(seed);
}

interface IdentityDidCrypto {
  didDetails: DidDetails;
  keystore: KeystoreSigner;
  sign: (plaintext: string) => {
    signature: HexString;
    didKeyUri: DidPublicKey['id'];
  };
  encrypt: (
    messageBody: MessageBody,
    dAppDidDetails: DidDetails,
  ) => Promise<IEncryptedMessage>;
}

function deriveAuthenticationKey(seed: Uint8Array): KeyringPair {
  return getKeypairBySeed(seed).derive('//did//0');
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
    type: EncryptionKeyType.X25519,
  };
}

function deriveEncryptionKeyLegacy(seed: Uint8Array) {
  const keypair = getKeypairBySeed(seed);
  const encryptionKeyringPair = keypair.derive('//did//keyAgreement//0');

  const secret = encryptionKeyringPair
    .encryptMessage(
      new Uint8Array(24).fill(0),
      new Uint8Array(24).fill(0),
      new Uint8Array(24).fill(0),
    )
    .slice(24); // first 24 bytes are the nonce

  const encryptionKeypair = naclBoxPairFromSecret(secret);
  return { ...encryptionKeypair, type: EncryptionKeyType.X25519 };
}

export async function getKeystoreFromSeed(
  seed: Uint8Array,
): Promise<KeystoreSigner> {
  await fixLightDidIssues(seed);

  const authenticationKey = deriveAuthenticationKey(seed);
  return {
    sign: async ({ data, alg }) => ({
      data: authenticationKey.sign(data, { withType: false }),
      alg,
    }),
  };
}

async function fixLightDidIssues(seed: Uint8Array) {
  const identities = await getIdentities();
  const { address } = getKeypairBySeed(seed);
  const identity = identities[address];

  if (!identity) {
    // could be the Alice identity
    return;
  }

  const parsed = identity.did && DidUtils.parseDidUri(identity.did);
  if (parsed && parsed.type !== 'light') {
    return;
  }

  try {
    // If this light DID was created and stored using SDK@0.24.0 then its keys are serialized using base64,
    // resulting in an invalid URI, so resolving would throw an exception.
    const details = await getDidDetails(identity.did);

    // Another issue we see is the light DIDs without key agreement keys, need to regenerate them as well
    const encryptionKey = getDidEncryptionKey(details);

    // This public key also means the DID needs to be regenerated
    const troubleKey =
      '0xf2c90875e0630bd1700412341e5e9339a57d2fefdbba08de1cac8db5b4145f6e';
    if (Crypto.u8aToHex(encryptionKey.publicKey) === troubleKey) {
      throw new Error();
    }
  } catch {
    // We re-create the invalid DID from scratch and update its URI in the identity.
    const { did } = getLightDidFromSeed(seed);
    await saveIdentity({ ...identity, did });
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

  const { address } = getKeypairBySeed(seed);
  const identities = await getIdentities();
  const { did } = identities[address];

  const didDetails = await getDidDetails(did);
  const keystore = await getKeystoreFromSeed(seed);

  const encryptionKeystore: Pick<NaclBoxCapable, 'encrypt'> = {
    async encrypt({ data, alg, peerPublicKey }) {
      const { sealed, nonce } = naclSeal(
        data,
        encryptionKey.secretKey,
        peerPublicKey,
      );

      return {
        data: sealed,
        alg,
        nonce,
      };
    },
  };

  function sign(plaintext: string) {
    const signature = Crypto.u8aToHex(authenticationKey.sign(plaintext));

    const didKeyUri = didDetails.assembleKeyId(didDetails.authenticationKey.id);

    return { signature, didKeyUri };
  }

  async function encrypt(
    messageBody: MessageBody,
    dAppDidDetails: DidDetails,
  ): Promise<IEncryptedMessage> {
    const message = new Message(
      messageBody,
      didDetails.did,
      dAppDidDetails.did,
    );
    return message.encrypt(
      getDidEncryptionKey(didDetails).id,
      didDetails,
      encryptionKeystore,
      dAppDidDetails.assembleKeyId(getDidEncryptionKey(dAppDidDetails).id),
    );
  }

  return {
    didDetails,
    keystore,
    sign,
    encrypt,
  };
}

export async function encryptIdentity(
  backupPhrase: string,
  password: string,
): Promise<string> {
  const seed = mnemonicToMiniSecret(backupPhrase);
  const { address } = getKeypairByBackupPhrase(backupPhrase);
  await saveEncrypted(address, password, seed);
  return address;
}

export function getLightDidFromSeed(seed: Uint8Array): LightDidDetails {
  const authenticationKey = deriveAuthenticationKey(seed);
  const encryptionKey = deriveEncryptionKeyFromSeed(seed);
  return LightDidDetails.fromDetails({
    authenticationKey: {
      ...authenticationKey,
      type: VerificationKeyType.Sr25519,
    },
    encryptionKey,
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

  const { did } = getLightDidFromSeed(seed);

  const { name, index } = await getIdentityName();

  const identity = { name, address, did, index };
  await saveIdentity(identity);

  return identity;
}

export async function importIdentity(
  backupPhrase: string,
  password: string,
): Promise<Identity> {
  const address = await encryptIdentity(backupPhrase, password);

  const seed = mnemonicToMiniSecret(backupPhrase);

  const lightDidDetails = getLightDidFromSeed(seed);
  const resolved = await DidResolver.resolveDoc(lightDidDetails.did);

  const did =
    resolved && resolved.metadata && resolved.metadata.canonicalId
      ? resolved.metadata.canonicalId
      : lightDidDetails.did;

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

  if (!identity.did) {
    // could be a legacy identity without DID
    return;
  }

  const { lightDid, fullDid, type } = parseDidUri(identity.did);
  const wasOnChain = type === 'full';

  const resolved = await DidResolver.resolveDoc(identity.did);
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
