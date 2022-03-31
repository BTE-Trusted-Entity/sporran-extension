import BN from 'bn.js';
import { IDidDetails, SubmittableExtrinsic } from '@kiltprotocol/types';
import {
  BlockchainApiConnection,
  BlockchainUtils,
} from '@kiltprotocol/chain-helpers';
import { DidChain } from '@kiltprotocol/did';

import {
  getKeystoreFromSeed,
  Identity,
  getLightDidFromSeed,
  getKeypairBySeed,
} from '../identities/identities';
import { getFullDidDetails } from '../did/did';

interface DidTransaction {
  extrinsic: SubmittableExtrinsic;
  did: IDidDetails['did'];
}

export async function getDeposit(): Promise<BN> {
  return DidChain.queryDepositAmount();
}

async function getSignedTransaction(
  seed: Uint8Array,
  fullDid: IDidDetails['did'],
): Promise<DidTransaction> {
  const fullDidDetails = await getFullDidDetails(fullDid);

  const extrinsic = await DidChain.getDeleteDidExtrinsic(
    await DidChain.queryEndpointsCounts(fullDidDetails.identifier),
  );
  const keystore = await getKeystoreFromSeed(seed);
  const keypair = getKeypairBySeed(seed);

  const didAuthorizedExtrinsic = await fullDidDetails.authorizeExtrinsic(
    extrinsic,
    keystore,
    keypair.address,
  );

  const blockchain = await BlockchainApiConnection.getConnectionOrConnect();
  const tx = await blockchain.signTx(keypair, didAuthorizedExtrinsic);

  const { did } = getLightDidFromSeed(seed);
  return { extrinsic: tx, did };
}

export async function getFee(did: IDidDetails['did']): Promise<BN> {
  const fakeSeed = new Uint8Array(32);
  const keypair = getKeypairBySeed(fakeSeed);
  const { extrinsic } = await getSignedTransaction(fakeSeed, did);

  return (await extrinsic.paymentInfo(keypair)).partialFee;
}

const currentTx: Record<string, DidTransaction> = {};

export async function sign(
  identity: Identity,
  seed: Uint8Array,
): Promise<string> {
  const { extrinsic, did } = await getSignedTransaction(seed, identity.did);

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
