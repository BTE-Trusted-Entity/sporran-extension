import { useContext } from 'react';
import useSWR, { mutate, SWRResponse } from 'swr';
import { Identity as SdkIdentity } from '@kiltprotocol/core';
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

export async function encryptIdentity(
  backupPhrase: string,
  password: string,
): Promise<string> {
  const { address, seed } = SdkIdentity.buildFromMnemonic(backupPhrase);
  await saveEncrypted(address, password, seed);
  return address;
}

export async function createIdentity(
  backupPhrase: string,
  password: string,
): Promise<Identity> {
  const address = await encryptIdentity(backupPhrase, password);

  const identities = await getIdentities();
  const largestIndex = max(map(identities, 'index')) || 0;

  const index = 1 + largestIndex;

  const name =
    index === 1 ? 'My Sporran Identity' : `My Sporran Identity ${index}`;

  const identity = { name, address, index };
  await saveIdentity(identity);

  return identity;
}

export async function decryptIdentity(
  address: string,
  password: string,
): Promise<SdkIdentity> {
  const seed = await loadEncrypted(address, password);
  return SdkIdentity.buildFromSeed(new Uint8Array(seed));
}
