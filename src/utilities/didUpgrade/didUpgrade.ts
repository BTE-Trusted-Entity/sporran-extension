import BN from 'bn.js';
import { IDidDetails, SubmittableExtrinsic } from '@kiltprotocol/types';
import {
  BlockchainApiConnection,
  BlockchainUtils,
} from '@kiltprotocol/chain-helpers';
import { DidChain, FullDidCreationBuilder } from '@kiltprotocol/did';

import {
  getKeystoreFromSeed,
  Identity,
  getLightDidFromSeed,
  getKeypairBySeed,
} from '../identities/identities';
import { getDidEncryptionKey, parseDidUri } from '../did/did';

interface DidTransaction {
  extrinsic: SubmittableExtrinsic;
  did: IDidDetails['did'];
}

export async function getDeposit(): Promise<BN> {
  return DidChain.queryDepositAmount();
}

async function getSignedTransaction(seed: Uint8Array): Promise<DidTransaction> {
  const keystore = await getKeystoreFromSeed(seed);
  const keypair = getKeypairBySeed(seed);

  const lightDidDetails = getLightDidFromSeed(seed);
  const { fullDid: did } = parseDidUri(lightDidDetails.did);

  const blockchain = await BlockchainApiConnection.getConnectionOrConnect();
  const encryptionKey = getDidEncryptionKey(lightDidDetails);

  const extrinsic = await new FullDidCreationBuilder(
    blockchain.api,
    lightDidDetails.authenticationKey,
  )
    .addEncryptionKey(encryptionKey)
    .consume(keystore, keypair.address);

  const tx = await blockchain.signTx(keypair, extrinsic);
  return { extrinsic: tx, did };
}

export async function getFee(): Promise<BN> {
  const fakeSeed = new Uint8Array(32);
  const keypair = getKeypairBySeed(fakeSeed);
  const { extrinsic } = await getSignedTransaction(fakeSeed);

  return (await extrinsic.paymentInfo(keypair)).partialFee;
}

const currentTx: Record<string, DidTransaction> = {};

export async function sign(
  identity: Identity,
  seed: Uint8Array,
): Promise<string> {
  const { extrinsic, did } = await getSignedTransaction(seed);

  const hash = extrinsic.hash.toHex();
  currentTx[hash] = { extrinsic, did };
  return hash;
}

export async function submit(hash: string): Promise<string> {
  const { extrinsic, did } = currentTx[hash];
  await BlockchainUtils.submitSignedTx(extrinsic, {
    resolveOn: BlockchainUtils.IS_FINALIZED,
  });
  delete currentTx[hash];

  return did;
}
