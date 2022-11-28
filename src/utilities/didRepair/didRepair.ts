import BN from 'bn.js';
import {
  DidUri,
  KiltEncryptionKeypair,
  KiltKeyringPair,
  SignExtrinsicCallback,
  SubmittableExtrinsic,
} from '@kiltprotocol/types';
import { ConfigService } from '@kiltprotocol/config';
import { Blockchain } from '@kiltprotocol/chain-helpers';
import * as Did from '@kiltprotocol/did';
import { Crypto } from '@kiltprotocol/utils';

import {
  deriveEncryptionKeyFromSeed,
  getIdentityCryptoFromSeed,
} from '../identities/identities';
import { getDidEncryptionKey, getFullDidDocument } from '../did/did';
import { makeFakeIdentityCrypto } from '../makeFakeIdentityCrypto/makeFakeIdentityCrypto';

async function getSignedTransaction(
  keypair: KiltKeyringPair,
  sign: SignExtrinsicCallback,
  fullDid: DidUri,
  newKey: KiltEncryptionKeypair,
): Promise<SubmittableExtrinsic> {
  const fullDidDocument = await getFullDidDocument(fullDid);

  const existingKey = getDidEncryptionKey(fullDidDocument);

  const keyToUpdate =
    '0xf2c90875e0630bd1700412341e5e9339a57d2fefdbba08de1cac8db5b4145f6e';
  const noUpdateNeeded = Crypto.u8aToHex(existingKey.publicKey) !== keyToUpdate;
  if (noUpdateNeeded) {
    throw new Error('DID repair not needed');
  }

  const api = ConfigService.get('api');

  const authorized = await Did.authorizeBatch({
    batchFunction: api.tx.utility.batchAll,
    did: fullDid,
    extrinsics: [
      api.tx.did.removeKeyAgreementKey(Did.resourceIdToChain(existingKey.id)),
      api.tx.did.addKeyAgreementKey(Did.publicKeyToChain(newKey)),
    ],
    submitter: keypair.address,
    sign,
  });

  return authorized.signAsync(keypair);
}

export async function getFee(did: DidUri): Promise<BN> {
  const { keypair, sign, fakeSeed } = makeFakeIdentityCrypto();
  const newKey = deriveEncryptionKeyFromSeed(fakeSeed);
  const extrinsic = await getSignedTransaction(keypair, sign, did, newKey);

  return (await extrinsic.paymentInfo(keypair)).partialFee;
}

const currentTx: Record<string, SubmittableExtrinsic> = {};

export async function sign(did: DidUri, seed: Uint8Array): Promise<string> {
  const { sign, keypair } = await getIdentityCryptoFromSeed(seed);
  const newKey = deriveEncryptionKeyFromSeed(seed);
  const extrinsic = await getSignedTransaction(keypair, sign, did, newKey);

  const hash = extrinsic.hash.toHex();
  currentTx[hash] = extrinsic;
  return hash;
}

export async function submit(hash: string): Promise<void> {
  const extrinsic = currentTx[hash];
  await Blockchain.submitSignedTx(extrinsic);
  delete currentTx[hash];
}
