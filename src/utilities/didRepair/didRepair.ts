import BN from 'bn.js';
import {
  IDidDetails,
  KeyRelationship,
  SubmittableExtrinsic,
} from '@kiltprotocol/types';
import {
  BlockchainApiConnection,
  BlockchainUtils,
} from '@kiltprotocol/chain-helpers';
import { DidChain, DidUtils } from '@kiltprotocol/did';

import {
  getKeystoreFromSeed,
  getKeypairBySeed,
  deriveEncryptionKeyFromSeed,
} from '../identities/identities';
import { queryFullDetailsFromIdentifier } from '../did/did';
import { didAuthorizeBatchExtrinsic } from '../didAuthorizeBatchExtrinsic/didAuthorizeBatchExtrinsic';

const { keyAgreement } = KeyRelationship;

async function getSignedTransaction(
  seed: Uint8Array,
  fullDid: IDidDetails['did'],
): Promise<SubmittableExtrinsic> {
  const fullDidDetails = await queryFullDetailsFromIdentifier(
    DidUtils.parseDidUrl(fullDid).identifier,
  );
  if (!fullDidDetails) {
    throw new Error(`Could not resolve DID ${fullDid}`);
  }

  const existingKey = fullDidDetails.getKeys(keyAgreement).pop();
  if (!existingKey) {
    throw new Error('Key agreement key not found');
  }

  const keyToUpdate =
    '0xf2c90875e0630bd1700412341e5e9339a57d2fefdbba08de1cac8db5b4145f6e';
  const noUpdateNeeded = existingKey.publicKeyHex !== keyToUpdate;
  if (noUpdateNeeded) {
    throw new Error('DID repair not needed');
  }

  const existingKeyId = DidUtils.parseDidUrl(existingKey.id).fragment;

  const encryptionKey = deriveEncryptionKeyFromSeed(seed);

  const blockchain = await BlockchainApiConnection.getConnectionOrConnect();

  const batchExtrinsic = blockchain.api.tx.utility.batchAll([
    await DidChain.getRemoveKeyExtrinsic(keyAgreement, existingKeyId),
    await DidChain.getAddKeyExtrinsic(keyAgreement, encryptionKey),
  ]);

  const keystore = await getKeystoreFromSeed(seed);
  const keypair = getKeypairBySeed(seed);

  const authorized = await didAuthorizeBatchExtrinsic(
    fullDidDetails,
    batchExtrinsic,
    keystore,
    keypair.address,
  );

  return await blockchain.signTx(keypair, authorized);
}

export async function getFee(did: IDidDetails['did']): Promise<BN> {
  const fakeSeed = new Uint8Array(32);
  const blockchain = await BlockchainApiConnection.getConnectionOrConnect();

  const extrinsic = await getSignedTransaction(fakeSeed, did);

  const { partialFee } = await blockchain.api.rpc.payment.queryInfo(
    extrinsic.toHex(),
  );
  return partialFee;
}

const currentTx: Record<string, SubmittableExtrinsic> = {};

export async function sign(
  did: IDidDetails['did'],
  seed: Uint8Array,
): Promise<string> {
  const extrinsic = await getSignedTransaction(seed, did);

  const hash = extrinsic.hash.toHex();
  currentTx[hash] = extrinsic;
  return hash;
}

export async function submit(hash: string): Promise<void> {
  const extrinsic = currentTx[hash];
  await BlockchainUtils.submitSignedTx(extrinsic, {
    resolveOn: BlockchainUtils.IS_FINALIZED,
  });
  delete currentTx[hash];
}
