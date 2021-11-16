import {
  DefaultResolver,
  DidChain,
  DidUtils,
  FullDidDetails,
} from '@kiltprotocol/did';
import { IDidDetails, IIdentity, KeyRelationship } from '@kiltprotocol/types';

export function isFullDid(did: IDidDetails['did']): boolean {
  return DidUtils.parseDidUrl(did).type === 'full';
}

export async function getDidDetails(
  did: IDidDetails['did'],
): Promise<IDidDetails> {
  const resolved = await DefaultResolver.resolveDoc(did);
  if (!resolved || !resolved.details) {
    throw new Error(`Cannot resolve DID ${did}`);
  }
  return resolved.details;
}

/** A copy of DefaultResolver.queryFullDetailsFromIdentifier which is not yet exported */
export async function queryFullDetailsFromIdentifier(
  identifier: IIdentity['address'],
  version = FullDidDetails.FULL_DID_LATEST_VERSION,
): Promise<FullDidDetails | null> {
  const didRec = await DidChain.queryById(identifier);
  if (!didRec) return null;
  const {
    publicKeys,
    assertionMethodKey,
    authenticationKey,
    capabilityDelegationKey,
    keyAgreementKeys,
    lastTxCounter,
  } = didRec;

  const keyRelationships: FullDidDetails['keyRelationships'] = {
    [KeyRelationship.authentication]: [authenticationKey],
    [KeyRelationship.keyAgreement]: keyAgreementKeys,
  };
  if (assertionMethodKey) {
    keyRelationships[KeyRelationship.assertionMethod] = [assertionMethodKey];
  }
  if (capabilityDelegationKey) {
    keyRelationships[KeyRelationship.capabilityDelegation] = [
      capabilityDelegationKey,
    ];
  }

  const did = DidUtils.getKiltDidFromIdentifier(identifier, 'full', version);

  const serviceEndpoints = await DidChain.queryServiceEndpoints(did);

  return new FullDidDetails({
    did,
    keys: publicKeys,
    keyRelationships,
    lastTxIndex: lastTxCounter.toBn(),
    serviceEndpoints,
  });
}
