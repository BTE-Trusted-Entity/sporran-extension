import { useContext, useEffect, useMemo } from 'react';
import { pick, pull } from 'lodash-es';
import { IRequestForAttestation, IDidDetails } from '@kiltprotocol/types';
import { Attestation } from '@kiltprotocol/core';
import { mutate } from 'swr';

import { storage } from '../storage/storage';
import { parseDidUrl } from '../did/did';

import { CredentialsContext } from './CredentialsContext';

type AttestationStatus = 'pending' | 'attested' | 'revoked' | 'invalid';

export interface Credential {
  request: IRequestForAttestation;
  name: string;
  cTypeTitle: string;
  attester: string;
  status: AttestationStatus;
  isDownloaded?: boolean;
}

function toKey(hash: string): string {
  return `credential:${hash}`;
}

export const LIST_KEY = toKey('list');

export async function getList(): Promise<string[]> {
  return (await storage.get(LIST_KEY))[LIST_KEY] || [];
}

async function saveList(list: string[]): Promise<void> {
  await storage.set({ [LIST_KEY]: list });
  await mutate(LIST_KEY);
}

export async function saveCredential(credential: Credential): Promise<void> {
  const key = toKey(credential.request.rootHash);
  await storage.set({ [key]: credential });
  await mutate(key);

  const list = await getList();
  list.push(key);
  await saveList(list);
}

export async function getCredentials(keys: string[]): Promise<Credential[]> {
  const result = await storage.get(keys);
  const credentials = pick(result, keys);
  return Object.values(credentials);
}

export async function deleteCredential(credential: Credential): Promise<void> {
  const key = toKey(credential.request.rootHash);
  await storage.remove(key);

  const list = await getList();
  pull(list, key);

  await saveList(list);
}

export function useCredentials(): Credential[] | undefined {
  return useContext(CredentialsContext);
}

export function useIdentityCredentials(
  did: IDidDetails['did'],
): Credential[] | undefined {
  const all = useCredentials();

  return useMemo(() => {
    if (!all) {
      // storage data pending
      return undefined;
    }
    if (!did) {
      // could be a legacy identity without DID
      return [];
    }
    const { fullDid } = parseDidUrl(did);
    return all.filter(
      (credential) =>
        parseDidUrl(credential.request.claim.owner).fullDid === fullDid,
    );
  }, [all, did]);
}

export function usePendingCredentialCheck(
  credential: Credential | undefined,
): void {
  useEffect(() => {
    if (!credential || credential.status !== 'pending') {
      return;
    }
    (async () => {
      const isAttested = await Attestation.query(credential.request.rootHash);
      if (isAttested) {
        await saveCredential({ ...credential, status: 'attested' });
      }
    })();
  }, [credential]);
}

interface CredentialDownload {
  name: string;
  url: string;
}

export function getCredentialDownload(
  credential: Credential,
): CredentialDownload {
  const name = `${credential.name}-${credential.cTypeTitle}.json`;

  const blob = window.btoa(JSON.stringify(credential));
  const url = `data:text/json;base64,${blob}`;

  return { name, url };
}

export async function invalidateCredentials(
  credentials: Credential[],
): Promise<void> {
  for (const credential of credentials) {
    await saveCredential({ ...credential, status: 'invalid' });
  }
}
