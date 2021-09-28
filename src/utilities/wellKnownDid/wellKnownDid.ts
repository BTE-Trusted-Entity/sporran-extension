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
  if (
    didConfigResource.linked_dids.filter(
      (credential) => credential.credentialSubject.id === did,
    ).length > 0
  ) {
    return;
  }
  throw new Error('DID does not match any domain linkage credentials');
}
