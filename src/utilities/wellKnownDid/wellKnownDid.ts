import ky from 'ky';
import { IDidDetails } from '@kiltprotocol/types';
import { AnyJson } from '@polkadot/types/types';

interface Proof {
  type: string;
  created?: string;
  proofPurpose?: string;
  [key: string]: unknown;
}

interface DomainLinkageCredential {
  '@context': string[];
  type: string[];
  credentialSubject: Record<string, AnyJson>;
  issuer: string;
  issuanceDate: string;
  expirationDate: string;
  proof: Proof | Proof[];
}

export async function verifyWellKnownDid(
  did: IDidDetails['did'],
  tabUrl: string,
): Promise<void> {
  const url = new URL(tabUrl);
  const didConfigResource = (await ky
    .get(`${url.origin}/.well-known/did-configuration.json`)
    .json()) as {
    '@context': string;
    linked_dids: DomainLinkageCredential[];
  };
  const credential = didConfigResource.linked_dids.find(
    (credential) =>
      credential.credentialSubject.id === did &&
      url.origin === credential.credentialSubject.origin,
  );
  if (!credential) {
    throw new Error(
      'DID and origin do not match any domain linkage credentials',
    );
  }
  return;
}
