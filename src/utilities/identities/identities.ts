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
  EncryptionKeyType,
  IEncryptedMessage,
  KeystoreSigner,
  MessageBody,
  NaclBoxCapable,
  VerificationKeyType,
  DidUri,
  DidResourceUri,
} from '@kiltprotocol/types';
import { Message } from '@kiltprotocol/messaging';
import { DidDetails, DidResolver, LightDidDetails } from '@kiltprotocol/did';
import { Crypto } from '@kiltprotocol/utils';
import { map, max } from 'lodash-es';

import {
  loadEncrypted,
  saveEncrypted,
} from '../storageEncryption/storageEncryption';

import { getDidDetails, getDidEncryptionKey } from '../did/did';
import { storage } from '../storage/storage';
import { useSwrDataOrThrow } from '../useSwrDataOrThrow/useSwrDataOrThrow';

import { IdentitiesContext, IdentitiesContextType } from './IdentitiesContext';
import { IDENTITIES_KEY, getIdentities } from './getIdentities';

import { Identity } from './types';
export { Identity, IdentitiesMap } from './types';

const CURRENT_IDENTITY_KEY = 'currentIdentity';

export const NEW: Identity = {
  address: 'NEW',
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
    didKeyUri: DidResourceUri;
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

export async function getKeystoreFromSeed(
  seed: Uint8Array,
): Promise<KeystoreSigner> {
  const authenticationKey = deriveAuthenticationKey(seed);
  return {
    sign: async ({ data, alg }) => ({
      data: authenticationKey.sign(data, { withType: false }),
      alg,
    }),
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

    const didKeyUri = didDetails.assembleKeyUri(
      didDetails.authenticationKey.id,
    );

    return { signature, didKeyUri };
  }

  async function encrypt(
    messageBody: MessageBody,
    dAppDidDetails: DidDetails,
  ): Promise<IEncryptedMessage> {
    const message = new Message(
      messageBody,
      didDetails.uri,
      dAppDidDetails.uri,
    );
    return message.encrypt(
      getDidEncryptionKey(didDetails).id,
      didDetails,
      encryptionKeystore,
      dAppDidDetails.assembleKeyUri(getDidEncryptionKey(dAppDidDetails).id),
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

  const lightDidDetails = getLightDidFromSeed(seed);
  const resolved = await DidResolver.resolveDoc(lightDidDetails.uri);

  const did =
    resolved && resolved.metadata && resolved.metadata.canonicalId
      ? resolved.metadata.canonicalId
      : lightDidDetails.uri;

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

export function useCurrentIdentity(): string | null | undefined {
  const data = useSwrDataOrThrow(
    CURRENT_IDENTITY_KEY,
    getCurrentIdentity,
    'getCurrentIdentity',
  );

  return data;
}
