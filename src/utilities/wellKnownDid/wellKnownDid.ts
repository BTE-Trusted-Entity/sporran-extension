import ky from 'ky';
import {
  IDidDetails,
  IRequestForAttestation,
  KeyRelationship,
} from '@kiltprotocol/types';
import { DidUtils } from '@kiltprotocol/did';
import { Crypto } from '@kiltprotocol/utils';

import { getDidDetails } from '../did/did';

interface CredentialSubject {
  id: IDidDetails['did'];
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
  signedRequest: IRequestForAttestation;
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
  did: IDidDetails['did'],
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

      const isDid = DidUtils.validateKiltDid(credentialSubject.id);
      const matchesIssuer = issuer === credentialSubject.id;
      if (!isDid || !matchesIssuer) {
        return false;
      }

      const matchesOrigin = origin === credentialSubject.origin;
      if (!matchesOrigin) {
        return false;
      }

      let issuerDidDetails: IDidDetails;
      try {
        issuerDidDetails = await getDidDetails(issuer);
      } catch {
        return false;
      }

      const { verified } = await DidUtils.verifyDidSignature({
        signature: {
          keyId: issuerDidDetails.getVerificationKeys(
            KeyRelationship.assertionMethod,
          )[0].id,
          signature: credential.proof.signature as string,
        },
        message: Crypto.coToUInt8(credentialSubject.rootHash),
      });
      return verified;
    },
  );
  if (!verified) {
    throw new Error(
      `Verification of DID configuration resource of ${origin} failed for ${did}`,
    );
  }
}
