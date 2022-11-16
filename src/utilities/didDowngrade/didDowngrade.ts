import BN from 'bn.js';
import { DidUri, SubmittableExtrinsic } from '@kiltprotocol/types';
import {
  BlockchainApiConnection,
  BlockchainUtils,
} from '@kiltprotocol/chain-helpers';
import { Chain, Web3Names } from '@kiltprotocol/did';

import {
  getKeystoreFromSeed,
  Identity,
  getLightDidFromSeed,
  getKeypairBySeed,
} from '../identities/identities';
import { getFullDidDetails, isFullDid } from '../did/did';

interface DidTransaction {
  extrinsic: SubmittableExtrinsic;
  did: DidUri;
}

async function getSignedTransaction(
  seed: Uint8Array,
  fullDid: DidUri,
): Promise<DidTransaction> {
  const fullDidDetails = await getFullDidDetails(fullDid);

  const blockchain = await BlockchainApiConnection.getConnectionOrConnect();
  const keystore = await getKeystoreFromSeed(seed);
  const keypair = getKeypairBySeed(seed);

  const didRemoveExtrinsic = await Chain.getDeleteDidExtrinsic(
    await Chain.queryEndpointsCounts(fullDidDetails.identifier),
  );

  const web3name = await Web3Names.queryWeb3NameForDid(fullDidDetails.uri);

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

  const { uri } = getLightDidFromSeed(seed);
  return { extrinsic: tx, did: uri };
}

export async function getFee(did: DidUri | undefined): Promise<BN> {
  if (!did || !isFullDid(did)) {
    return new BN(0);
  }
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
  if (!identity.did) {
    throw new Error('DID is deleted and unusable');
  }
  const { extrinsic, did } = await getSignedTransaction(seed, identity.did);

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
