import type { Did } from '@kiltprotocol/types';

import ky from 'ky';

import { validateDid, verifyDidSignature } from '@kiltprotocol/did';
import { Crypto } from '@kiltprotocol/utils';

import { getDidDocument } from '../did/did';

interface CredentialSubject {
  id: Did;
  origin: string;
  rootHash: string;
}

interface Proof {
  type: string;
  created?: string;
  proofPurpose?: string;

  [key: string]: unknown;
}

interface DomainLinkageCredential {
  '@context': string[];
  type: string[];
  credentialSubject: CredentialSubject;
  issuer: string;
  issuanceDate: string;
  expirationDate: string;
  proof: Proof;
}

async function asyncSome(
  credentials: DomainLinkageCredential[],
  verify: (credential: DomainLinkageCredential) => Promise<boolean>,
) {
  for (const credential of credentials) {
    if (await verify(credential)) return true;
  }
  return false;
}

export async function verifyDidConfigResource(
  did: Did,
  tabUrl: string,
): Promise<void> {
  const { origin } = new URL(tabUrl);
  const url = `${origin}/.well-known/did-configuration.json`;

  let didConfigResource: {
    '@context': string;
    linked_dids: DomainLinkageCredential[];
  };
  try {
    didConfigResource = await ky.get(url).json();
  } catch (cause) {
    console.error(cause);
    throw new Error(`Could not fetch ${url}: ${cause}`);
  }

  // Verification steps outlined in Well Known DID Configuration
  // https://identity.foundation/.well-known/resources/did-configuration/#did-configuration-resource-verification

  let verificationError = new Error('No "linked_dids"');
  const verified = await asyncSome(
    didConfigResource.linked_dids,
    async (credential) => {
      try {
        const { issuer, credentialSubject } = credential;

        const matchesSessionDid = did === credentialSubject.id;
        if (!matchesSessionDid) {
          throw new Error(
            `The credential at ${url} is issued for ${credentialSubject.id} but message came from ${did}`,
          );
        }

        validateDid(credentialSubject.id, 'Did');
        const matchesIssuer = issuer === credentialSubject.id;
        if (!matchesIssuer) {
          throw new Error(
            `The credential at ${url} is issued by ${issuer} and not by ${credentialSubject.id}`,
          );
        }

        const matchesOrigin = origin === credentialSubject.origin;
        if (!matchesOrigin) {
          throw new Error(
            `The credential at ${url} is issued for origin ${credentialSubject.origin} but message came from ${origin}`,
          );
        }

        const issuerDidDocument = await getDidDocument(issuer as Did);
        if (!issuerDidDocument.assertionMethod?.[0]) {
          throw new Error(
            `The credential at ${url} is issued for ${credentialSubject.id} but this DID has no assertionMethod key`,
          );
        }

        await verifyDidSignature({
          signerUrl: `${issuerDidDocument.id}${issuerDidDocument.assertionMethod?.[0]}`,
          signature: Crypto.coToUInt8(credential.proof.signature as string),
          message: Crypto.coToUInt8(credentialSubject.rootHash),
        });

        return true;
      } catch (error) {
        console.error(error);
        verificationError = error as Error;
        return false;
      }
    },
  );
  if (!verified) {
    throw new Error(
      `Verification of ${url} failed for ${did}: ${verificationError}`,
    );
  }
}
