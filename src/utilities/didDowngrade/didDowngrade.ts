import BN from 'bn.js';
import { IDidDetails, SubmittableExtrinsic } from '@kiltprotocol/types';
import {
  BlockchainApiConnection,
  BlockchainUtils,
} from '@kiltprotocol/chain-helpers';
import { DidChain, Web3Names } from '@kiltprotocol/did';

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

async function getSignedTransaction(
  seed: Uint8Array,
  fullDid: IDidDetails['did'],
): Promise<DidTransaction> {
  const fullDidDetails = await getFullDidDetails(fullDid);

  const blockchain = await BlockchainApiConnection.getConnectionOrConnect();
  const keystore = await getKeystoreFromSeed(seed);
  const keypair = getKeypairBySeed(seed);

  const didRemoveExtrinsic = await DidChain.getDeleteDidExtrinsic(
    await DidChain.queryEndpointsCounts(fullDidDetails.identifier),
  );

  const web3name = await Web3Names.queryWeb3NameForDid(fullDidDetails.did);

  let extrinsic: SubmittableExtrinsic;

  if (web3name) {
    const w3nRemoveExtrinsic = await Web3Names.getReleaseByOwnerTx();

    const txCounter = await fullDidDetails.getNextNonce();

    const w3nRemoveAuthorized = await fullDidDetails.authorizeExtrinsic(
      w3nRemoveExtrinsic,
      keystore,
      keypair.address,
      { txCounter },
    );
    txCounter.iaddn(1);
    const didRemoveAuthorized = await fullDidDetails.authorizeExtrinsic(
      didRemoveExtrinsic,
      keystore,
      keypair.address,
      { txCounter },
    );

    extrinsic = blockchain.api.tx.utility.batchAll([
      w3nRemoveAuthorized,
      didRemoveAuthorized,
    ]);
  } else {
    extrinsic = await fullDidDetails.authorizeExtrinsic(
      didRemoveExtrinsic,
      keystore,
      keypair.address,
    );
  }

  const tx = await blockchain.signTx(keypair, extrinsic);

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
