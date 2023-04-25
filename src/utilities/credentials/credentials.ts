import { useContext, useEffect, useMemo } from 'react';
import { isEqual, omit, pick, pull, reject, without } from 'lodash-es';
import {
  Attestation,
  ConfigService,
  Credential,
  Did,
  DidUri,
  ICredential,
  KiltPublishedCredentialCollectionV1,
} from '@kiltprotocol/sdk-js';
import { mutate } from 'swr';

import { storage } from '../storage/storage';
import { parseDidUri } from '../did/did';
import { jsonToBase64 } from '../base64/base64';

import { CredentialsContext } from './CredentialsContext';

type AttestationStatus = 'pending' | 'attested' | 'revoked' | 'invalid';

export interface SporranCredential {
  credential: ICredential;
  name: string;
  cTypeTitle: string;
  attester: string;
  status: AttestationStatus;
  isDownloaded?: boolean;
}

export interface SharedCredential {
  sporranCredential: SporranCredential;
  sharedContents: string[];
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
  await mutate(['getCredentials', LIST_KEY]);
}

export async function saveCredential(
  credential: SporranCredential,
): Promise<void> {
  const key = toKey(credential.credential.rootHash);
  await storage.set({ [key]: credential });
  await mutate(key);

  const list = await getList();
  if (list.includes(key)) {
    await mutate(['getCredentials', LIST_KEY]);
    return;
  }
  list.push(key);
  await saveList(list);
}

interface LegacySporranCredential
  extends Omit<SporranCredential, 'credential'> {
  request: ICredential & { claimerSignature?: unknown };
}

function isLegacySporranCredential(
  input: unknown,
): input is LegacySporranCredential {
  return typeof input === 'object' && input !== null && 'request' in input;
}

// SDK <0.29 had claimerSignature in ICredential
interface LegacyICredential extends ICredential {
  claimerSignature?: unknown;
}

function isLegacyICredential(input: unknown): input is LegacyICredential {
  return (
    typeof input === 'object' && input !== null && 'claimerSignature' in input
  );
}

export function updateLegacyCredential(sporranCredential: SporranCredential) {
  const modernCredential = !isLegacySporranCredential(sporranCredential)
    ? sporranCredential
    : {
        ...omit(sporranCredential, 'request'),
        credential: sporranCredential.request,
      };

  const { credential } = modernCredential;
  if (isLegacyICredential(credential)) {
    delete credential.claimerSignature;
  }

  return modernCredential;
}

async function updateLegacyStorage(keys: string[]) {
  const result: Record<string, SporranCredential> = await storage.get(keys);

  for (const [key, sporranCredential] of Object.entries(result)) {
    const modernCredential = updateLegacyCredential(sporranCredential);
    const updateStorage = !isEqual(sporranCredential, modernCredential);
    if (updateStorage) {
      await storage.set({ [key]: modernCredential });
    }
  }
}

export async function getCredentials(
  keys: string[],
): Promise<SporranCredential[]> {
  await updateLegacyStorage(keys);

  const result = await storage.get(keys);
  const credentials = pick(result, keys);
  return Object.values(credentials);
}

export async function deleteCredential(
  credential: SporranCredential,
): Promise<void> {
  const key = toKey(credential.credential.rootHash);
  await storage.remove(key);

  const list = await getList();
  pull(list, key);

  await saveList(list);
}

export function useCredentials(): SporranCredential[] | undefined {
  return useContext(CredentialsContext);
}

export function isUnusableCredential({ status }: SporranCredential) {
  return ['revoked', 'invalid'].includes(status);
}

export function useIdentityCredentials(
  did: DidUri | undefined,
  onlyUsable = true,
): SporranCredential[] | undefined {
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
    const usable = reject(all, isUnusableCredential);
    const unusable = all.filter(isUnusableCredential);
    const sorted = [...unusable, ...usable]; // will be displayed in the reverse order
    const filtered = onlyUsable ? usable : sorted;

    const { fullDid } = parseDidUri(did);
    return filtered.filter((credential) =>
      Did.isSameSubject(credential.credential.claim.owner, fullDid),
    );
  }, [all, did, onlyUsable]);
}

async function syncCredentialStatusWithChain(credential: SporranCredential) {
  const initialStatus = credential.status;
  const claimHash = credential.credential.rootHash;

  // revoked and invalid statuses are permanent
  if (['revoked', 'invalid'].includes(initialStatus)) {
    return;
  }

  try {
    const api = ConfigService.get('api');
    const chain = await api.query.attestation.attestations(claimHash);

    const hasBeenRemoved = chain.isNone && initialStatus === 'attested';

    if (hasBeenRemoved) {
      await saveCredential({ ...credential, status: 'revoked' });
    }

    const attestation = Attestation.fromChain(chain, claimHash);

    const hasBecomeRevoked = attestation.revoked;
    const hasBecomeAttested = initialStatus === 'pending' && !hasBecomeRevoked;

    if (hasBecomeRevoked) {
      await saveCredential({ ...credential, status: 'revoked' });
    }
    if (hasBecomeAttested) {
      await saveCredential({ ...credential, status: 'attested' });
    }
  } catch {
    // not on chain yet, ignore
  }
}

export function usePendingCredentialCheck(
  credential: SporranCredential | undefined,
): void {
  useEffect(() => {
    if (!credential || credential.status !== 'pending') {
      return;
    }
    (async () => {
      await syncCredentialStatusWithChain(credential);
    })();
  }, [credential]);
}

interface CredentialDownload {
  name: string;
  url: string;
}

export function getCredentialDownload(
  credential: SporranCredential,
): CredentialDownload {
  const name = `${credential.name}-${credential.cTypeTitle}.json`;

  const blob = jsonToBase64(credential);
  const url = `data:text/json;base64,${blob}`;

  return { name, url };
}

export function getUnsignedPresentationDownload(
  sporranCredential: SporranCredential,
  properties: string[],
): CredentialDownload {
  const name = `${sporranCredential.name}-${sporranCredential.cTypeTitle}-presentation.json`;

  const { credential } = sporranCredential;
  const allProperties = Object.keys(credential.claim.contents);
  const needRemoving = without(allProperties, ...properties);

  const credentialCopy = Credential.removeClaimProperties(
    credential,
    needRemoving,
  );

  const collection: KiltPublishedCredentialCollectionV1 = [
    { credential: credentialCopy },
  ];

  const blob = jsonToBase64(collection);
  const url = `data:text/json;base64,${blob}`;

  return { name, url };
}

export async function invalidateCredentials(
  credentials: SporranCredential[],
): Promise<void> {
  for (const credential of credentials) {
    await saveCredential({ ...credential, status: 'invalid' });
  }
}

export async function checkCredentialsStatus(
  credentials: SporranCredential[],
): Promise<void> {
  for (const credential of credentials) {
    await syncCredentialStatusWithChain(credential);
  }
}
