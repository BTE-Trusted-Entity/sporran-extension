import { FullDidDetails, DidChain, DidUtils } from '@kiltprotocol/did';
import {
  SubmittableExtrinsic,
  KeystoreSigner,
  IIdentity,
  KeyRelationship,
} from '@kiltprotocol/types';

const { authentication } = KeyRelationship;

// TODO: replace with authorizeBatch when SDK delivers it
export async function didAuthorizeBatchExtrinsic(
  fullDid: FullDidDetails,
  call: SubmittableExtrinsic,
  signer: KeystoreSigner,
  submitter: IIdentity['address'],
): Promise<SubmittableExtrinsic> {
  const [signingKey] = fullDid.getKeys(authentication);
  if (!signingKey) {
    throw new Error('Own signing key absent');
  }

  // TODO: Remove when we get SDK upgrade which includes this call in authorizeExtrinsic
  await fullDid.refreshTxIndex();
  const txCounter = fullDid.getNextTxIndex();

  return await DidChain.generateDidAuthenticatedTx({
    didIdentifier: fullDid.identifier,
    signingPublicKey: signingKey.publicKeyHex,
    alg: DidUtils.getSignatureAlgForKeyType(signingKey.type),
    signer,
    call,
    txCounter,
    submitter,
  });
}
