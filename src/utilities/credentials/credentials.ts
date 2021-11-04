import { useEffect, useState } from 'react';
import { filter, pick, remove } from 'lodash-es';
import { IRequestForAttestation, IDidDetails } from '@kiltprotocol/types';

import { storage } from '../storage/storage';

export interface Credential {
  request: IRequestForAttestation;
  name: string;
  cTypeTitle: string;
  attester: string;
  isAttested: boolean;
}

function toKey(hash: string): string {
  return `credential:${hash}`;
}

const listKey = toKey('list');

async function getList(): Promise<string[]> {
  return (await storage.get(listKey))[listKey] || [];
}

async function saveList(list: string[]): Promise<void> {
  await storage.set({ [listKey]: list });
}

export async function saveCredential(credential: Credential): Promise<void> {
  const key = toKey(credential.request.rootHash);
  await storage.set({ [key]: credential });

  const list = await getList();
  list.push(key);
  await saveList(list);
}

export async function getCredential(hash: string): Promise<Credential> {
  const key = toKey(hash);
  const credential = (await storage.get(key))[key];
  if (!credential) {
    throw new Error(`Unknown credential ${hash}`);
  }
  return credential;
}

export async function getAllCredentials(): Promise<Credential[]> {
  const keys = await getList();
  const result = await storage.get(keys);
  const credentials = pick(result, keys);
  return Object.values(credentials);
}

export async function deleteAttestedClaim(
  credential: Credential,
): Promise<void> {
  const key = toKey(credential.request.rootHash);
  await storage.remove(key);

  const list = await getList();
  remove(list, key);
  await saveList(list);
}

export function useCredential(hash: string): Credential | null {
  const [credential, setCredential] = useState<Credential | null>(null);

  useEffect(() => {
    (async () => {
      const savedCredential = await getCredential(hash);
      // TODO: decide on the interface for an unknown credential
      setCredential(savedCredential);
    })();
  }, [hash]);

  return credential;
}

export function useIdentityCredentials(
  did?: IDidDetails['did'],
): Credential[] | null {
  const [credentials, setCredentials] = useState<Credential[] | null>(null);

  useEffect(() => {
    (async () => {
      const all = await getAllCredentials();
      if (did) {
        const own = filter(all, { request: { claim: { owner: did } } });
        setCredentials(own);
      } else {
        setCredentials(all);
      }
    })();
  }, [did]);

  return credentials;
}
