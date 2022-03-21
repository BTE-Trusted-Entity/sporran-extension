import BN from 'bn.js';
import { IDidDetails, SubmittableExtrinsic } from '@kiltprotocol/types';
import {
  BlockchainApiConnection,
  BlockchainUtils,
} from '@kiltprotocol/chain-helpers';
import { FullDidUpdateBuilder } from '@kiltprotocol/did';
import { Crypto } from '@kiltprotocol/utils';

import {
  deriveEncryptionKeyFromSeed,
  getKeypairBySeed,
  getKeystoreFromSeed,
} from '../identities/identities';
import { getFullDidDetails } from '../did/did';
import { getExtrinsicFee } from '../getExtrinsicFee/getExtrinsicFee';

async function getSignedTransaction(
  seed: Uint8Array,
  fullDid: IDidDetails['did'],
): Promise<SubmittableExtrinsic> {
  const fullDidDetails = await getFullDidDetails(fullDid);

  const existingKey = fullDidDetails.encryptionKey;
  if (!existingKey) {
    throw new Error('Key agreement key not found');
  }

  const keyToUpdate =
    '0xf2c90875e0630bd1700412341e5e9339a57d2fefdbba08de1cac8db5b4145f6e';
  const noUpdateNeeded = Crypto.u8aToHex(existingKey.publicKey) !== keyToUpdate;
  if (noUpdateNeeded) {
    throw new Error('DID repair not needed');
  }

  const encryptionKey = deriveEncryptionKeyFromSeed(seed);

  const blockchain = await BlockchainApiConnection.getConnectionOrConnect();

  const keystore = await getKeystoreFromSeed(seed);
  const keypair = getKeypairBySeed(seed);

  const authorized = await new FullDidUpdateBuilder(
    blockchain.api,
    fullDidDetails,
  )
    .removeEncryptionKey(existingKey.id)
    .addEncryptionKey(encryptionKey)
    .consume(keystore, keypair.address);

  return await blockchain.signTx(keypair, authorized);
}

export async function getFee(did: IDidDetails['did']): Promise<BN> {
  const fakeSeed = new Uint8Array(32);
  const extrinsic = await getSignedTransaction(fakeSeed, did);
  return getExtrinsicFee(extrinsic);
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
