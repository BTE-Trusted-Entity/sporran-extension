import BN from 'bn.js';
import { KeyringPair } from '@polkadot/keyring/types';
import { IDidDetails, SubmittableExtrinsic } from '@kiltprotocol/types';
import {
  BlockchainApiConnection,
  BlockchainUtils,
} from '@kiltprotocol/chain-helpers';
import { DidChain, DidUtils } from '@kiltprotocol/did';

import {
  getKeystoreFromKeypair,
  Identity,
  getLightDidFromKeypair,
  makeKeyring,
} from '../identities/identities';
import { queryFullDetailsFromIdentifier } from '../did/did';

interface DidTransaction {
  extrinsic: SubmittableExtrinsic;
  did: IDidDetails['did'];
}

export async function getDeposit(): Promise<BN> {
  return DidChain.queryDepositAmount();
}

async function getSignedTransaction(
  keypair: KeyringPair,
  seed: Uint8Array,
  fullDid: IDidDetails['did'],
): Promise<DidTransaction> {
  const fullDidDetails = await queryFullDetailsFromIdentifier(
    DidUtils.parseDidUrl(fullDid).identifier,
  );
  if (!fullDidDetails) {
    throw new Error(`Could not resolve DID ${fullDid}`);
  }

  const extrinsic = await DidChain.getDeleteDidExtrinsic(
    await DidChain.queryEndpointsCounts(fullDidDetails.did),
  );
  const keystore = await getKeystoreFromKeypair(keypair, seed);

  const didAuthorizedExtrinsic = await fullDidDetails.authorizeExtrinsic(
    extrinsic,
    keystore,
    keypair.address,
  );

  const blockchain = await BlockchainApiConnection.getConnectionOrConnect();
  const tx = await blockchain.signTx(keypair, didAuthorizedExtrinsic);

  const { did } = getLightDidFromKeypair(keypair, seed);
  return { extrinsic: tx, did };
}

export async function getFee(did: IDidDetails['did']): Promise<BN> {
  const fakeIdentity = makeKeyring().createFromUri('//Alice');
  const blockchain = await BlockchainApiConnection.getConnectionOrConnect();

  const { extrinsic } = await getSignedTransaction(
    fakeIdentity,
    new Uint8Array(),
    did,
  );

  const { partialFee } = await blockchain.api.rpc.payment.queryInfo(
    extrinsic.toHex(),
  );
  return partialFee;
}

const currentTx: Record<string, DidTransaction> = {};

export async function sign(
  identity: Identity,
  keypair: KeyringPair,
  seed: Uint8Array,
): Promise<string> {
  const { extrinsic, did } = await getSignedTransaction(
    keypair,
    seed,
    identity.did,
  );

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
