import { useContext } from 'react';
import useSWR, { mutate, SWRResponse } from 'swr';
import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import {
  naclBoxKeypairFromSecret,
  naclSeal,
  mnemonicToMiniSecret,
} from '@polkadot/util-crypto';
import {
  IDidDetails,
  IEncryptedMessage,
  KeyRelationship,
  KeystoreSigner,
  MessageBody,
  NaclBoxCapable,
} from '@kiltprotocol/types';
import Message from '@kiltprotocol/messaging';
import { DefaultResolver, LightDidDetails } from '@kiltprotocol/did';
import { Crypto } from '@kiltprotocol/utils';
import { map, max } from 'lodash-es';

import {
  loadEncrypted,
  saveEncrypted,
} from '../storageEncryption/storageEncryption';
import { IdentitiesContext, IdentitiesContextType } from './IdentitiesContext';
import { storage } from '../storage/storage';
import { IDENTITIES_KEY, getIdentities } from './getIdentities';

import { Identity, IdentitiesMap } from './types';

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
  const stored = await storage.get([IDENTITIES_KEY, CURRENT_IDENTITY_KEY]);
  const identities = stored[IDENTITIES_KEY] as IdentitiesMap;
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
  await mutate(CURRENT_IDENTITY_KEY);
}

export function useCurrentIdentity(): SWRResponse<string | null, unknown> {
  return useSWR(CURRENT_IDENTITY_KEY, getCurrentIdentity);
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

interface IdentityDidCrypto {
  didDetails: IDidDetails;
  keystore: KeystoreSigner & Pick<NaclBoxCapable, 'encrypt'>;
  sign: (plaintext: string) => string;
  encrypt: (
    messageBody: MessageBody,
    dAppDidDetails: IDidDetails,
  ) => Promise<IEncryptedMessage>;
}

function deriveDidKeys(identityKeypair: KeyringPair) {
  const authenticationKey = identityKeypair.derive('//did//0');
  const encryptionKeypair = naclBoxKeypairFromSecret(
    identityKeypair
      .derive('//did//keyAgreement//0')
      .encryptMessage(
        new Uint8Array(24).fill(0),
        new Uint8Array(24).fill(0),
        new Uint8Array(24).fill(0),
      )
      .slice(24), // first 24 bytes are the nonce
  );
  const encryptionKey = { ...encryptionKeypair, type: 'x25519' };
  return { authenticationKey, encryptionKey };
}

export async function getIdentityCryptoFromKeypair(
  identityKeypair: KeyringPair,
): Promise<IdentityDidCrypto> {
  const { authenticationKey, encryptionKey } = deriveDidKeys(identityKeypair);

  const identities = await getIdentities();
  const { did } = identities[identityKeypair.address];

  const didDetails = (await DefaultResolver.resolveDoc(did)) as IDidDetails;
  if (!didDetails) {
    throw new Error(`Cannot resolve the DID ${did}`);
  }

  const keystore: KeystoreSigner & Pick<NaclBoxCapable, 'encrypt'> = {
    sign: async ({ data, alg }) => ({
      data: authenticationKey.sign(data, { withType: false }),
      alg,
    }),
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
    return Crypto.u8aToHex(authenticationKey.sign(plaintext));
  }

  async function encrypt(
    messageBody: MessageBody,
    dAppDidDetails: IDidDetails,
  ): Promise<IEncryptedMessage> {
    const message = new Message(
      messageBody,
      didDetails.did,
      dAppDidDetails.did,
    );
    return message.encrypt(
      didDetails.getKeys(KeyRelationship.keyAgreement)[0],
      dAppDidDetails.getKeys(KeyRelationship.keyAgreement)[0],
      keystore,
    );
  }

  return {
    didDetails,
    keystore,
    sign,
    encrypt,
  };
}

export async function getIdentityDidEncryption(
  address: string,
  password: string,
): Promise<IdentityDidCrypto> {
  const identityKeypair = await decryptIdentity(address, password);
  return getIdentityCryptoFromKeypair(identityKeypair);
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

export async function createIdentity(
  backupPhrase: string,
  password: string,
): Promise<Identity> {
  const address = await encryptIdentity(backupPhrase, password);

  const identityKeypair = getKeypairByBackupPhrase(backupPhrase);
  const { did } = new LightDidDetails(deriveDidKeys(identityKeypair));

  const identities = await getIdentities();
  const largestIndex = max(map(identities, 'index')) || 0;

  const index = 1 + largestIndex;

  const name = `KILT Identity ${index}`;

  const identity = { name, address, did, index };
  await saveIdentity(identity);

  return identity;
}

export async function decryptIdentity(
  address: string,
  password: string,
): Promise<KeyringPair> {
  const seed = await loadEncrypted(address, password);
  return makeKeyring().addFromSeed(new Uint8Array(seed));
}
