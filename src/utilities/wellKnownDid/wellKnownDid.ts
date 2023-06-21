import ky from 'ky';
import { Did, DidResourceUri, DidUri, Utils } from '@kiltprotocol/sdk-js';

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
          return false;
        }

        Did.validateUri(credentialSubject.id, 'Did');
        const matchesIssuer = issuer === credentialSubject.id;
        if (!matchesIssuer) {
          return false;
        }

        const matchesOrigin = origin === credentialSubject.origin;
        if (!matchesOrigin) {
          return false;
        }

        const issuerDidDocument = await getDidDocument(issuer);
        if (!issuerDidDocument.assertionMethod?.[0]) {
          return false;
        }

        await Did.verifyDidSignature({
          keyUri:
            `${issuerDidDocument.uri}${issuerDidDocument.assertionMethod?.[0].id}` as DidResourceUri,
          signature: Utils.Crypto.coToUInt8(
            credential.proof.signature as string,
          ),
          message: Utils.Crypto.coToUInt8(credentialSubject.rootHash),
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
