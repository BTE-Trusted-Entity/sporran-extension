import ky from 'ky';
import { DidUri, DidDocument, ICredential } from '@kiltprotocol/types';
import { validateUri, verifyDidSignature } from '@kiltprotocol/did';
import { Crypto } from '@kiltprotocol/utils';

import { getDidDocument } from '../did/did';

interface CredentialSubject {
  id: DidUri;
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
  signedRequest: ICredential;
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
  did: DidUri,
  tabUrl: string,
): Promise<void> {
  const { origin } = new URL(tabUrl);
  const didConfigResource = (await ky
    .get(`${origin}/.well-known/did-configuration.json`)
    .json()) as {
    '@context': string;
    linked_dids: DomainLinkageCredential[];
  };

  // Verification steps outlined in Well Known DID Configuration
  // https://identity.foundation/.well-known/resources/did-configuration/#did-configuration-resource-verification

  const verified = await asyncSome(
    didConfigResource.linked_dids,
    async (credential) => {
      const { issuer, credentialSubject } = credential;

      const matchesSessionDid = did === credentialSubject.id;
      if (!matchesSessionDid) {
        return false;
      }

      try {
        validateUri(credentialSubject.id, 'Did');
      } catch {
        return false;
      }
      const matchesIssuer = issuer === credentialSubject.id;
      if (!matchesIssuer) {
        return false;
      }

      const matchesOrigin = origin === credentialSubject.origin;
      if (!matchesOrigin) {
        return false;
      }

      let issuerDidDocument: DidDocument;
      try {
        issuerDidDocument = await getDidDocument(issuer);
      } catch {
        return false;
      }

      if (!issuerDidDocument.assertionMethod?.[0]) {
        return false;
      }

      return verifyDidSignature({
        signature: {
          keyUri: `${issuerDidDocument.uri}${issuerDidDocument.assertionMethod[0].id}`,
          signature: credential.proof.signature as string,
        },
        message: Crypto.coToUInt8(credentialSubject.rootHash),
      })
        .then(() => true)
        .catch(() => false);
    },
  );
  if (!verified) {
    throw new Error(
      `Verification of DID configuration resource of ${origin} failed for ${did}`,
    );
  }
}
