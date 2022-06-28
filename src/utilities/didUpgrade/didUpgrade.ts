import BN from 'bn.js';
import { DidUri, SubmittableExtrinsic } from '@kiltprotocol/types';
import {
  BlockchainApiConnection,
  BlockchainUtils,
} from '@kiltprotocol/chain-helpers';
import { Chain, FullDidCreationBuilder } from '@kiltprotocol/did';

import { u32 } from '@polkadot/types';

import {
  getKeystoreFromSeed,
  Identity,
  getLightDidFromSeed,
  getKeypairBySeed,
} from '../identities/identities';
import { getDidEncryptionKey, parseDidUri } from '../did/did';

interface DidTransaction {
  extrinsic: SubmittableExtrinsic;
  did: DidUri;
}

export async function getDeposit(): Promise<BN> {
  return Chain.queryDepositAmount();
}

async function getSignedTransaction(seed: Uint8Array): Promise<DidTransaction> {
  const keystore = await getKeystoreFromSeed(seed);
  const keypair = getKeypairBySeed(seed);

  const lightDidDetails = getLightDidFromSeed(seed);

  const { fullDid: did } = parseDidUri(lightDidDetails.uri);

  const blockchain = await BlockchainApiConnection.getConnectionOrConnect();
  const encryptionKey = getDidEncryptionKey(lightDidDetails);

  const extrinsic = await new FullDidCreationBuilder(
    blockchain.api,
    lightDidDetails.authenticationKey,
  )
    .addEncryptionKey(encryptionKey)
    .build(keystore, keypair.address);

  const tx = await blockchain.signTx(keypair, extrinsic);
  return { extrinsic: tx, did };
}

export async function getFee(): Promise<BN> {
  const fakeSeed = new Uint8Array(32);
  const keypair = getKeypairBySeed(fakeSeed);
  const { extrinsic } = await getSignedTransaction(fakeSeed);
  const extrinsicFee = (await extrinsic.paymentInfo(keypair)).partialFee;

  const { api } = await BlockchainApiConnection.getConnectionOrConnect();
  const didCreationFee = api.consts.did.fee as u32;

  return extrinsicFee.add(didCreationFee);
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

export async function submit(hash: string): Promise<DidUri> {
  const { extrinsic, did } = currentTx[hash];
  await BlockchainUtils.submitSignedTx(extrinsic, {
    resolveOn: BlockchainUtils.IS_FINALIZED,
  });
  delete currentTx[hash];

  return did;
}
