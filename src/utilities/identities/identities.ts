import { useContext } from 'react';
import useSWR, { mutate, SWRResponse } from 'swr';
import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { mnemonicToMiniSecret } from '@polkadot/util-crypto';
import { LightDidDetails } from '@kiltprotocol/did';
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

export function deriveDidAuthenticationKeypair(
  identityKeypair: KeyringPair,
): KeyringPair {
  return identityKeypair.derive('//did//0');
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
  const authenticationKey = deriveDidAuthenticationKeypair(identityKeypair);
  const { did } = new LightDidDetails({ authenticationKey });

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
