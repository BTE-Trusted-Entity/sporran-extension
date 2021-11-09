import BN from 'bn.js';
import { KeyringPair } from '@polkadot/keyring/types';
import { IDidDetails, SubmittableExtrinsic } from '@kiltprotocol/types';
import {
  BlockchainApiConnection,
  BlockchainUtils,
} from '@kiltprotocol/chain-helpers';
import { DidUtils } from '@kiltprotocol/did';
import { U128 } from '@polkadot/types';

import {
  decryptIdentity,
  getKeystoreFromKeypair,
  Identity,
  getLightDidFromKeypair,
  makeKeyring,
} from '../identities/identities';

interface DidTransaction {
  extrinsic: SubmittableExtrinsic;
  did: IDidDetails['did'];
}

export async function getDeposit(): Promise<BN> {
  const blockchain = await BlockchainApiConnection.getConnectionOrConnect();
  return blockchain.api.consts.did.deposit as U128;
}

async function getSignedTransaction(
  identity: KeyringPair,
): Promise<DidTransaction> {
  const keystore = getKeystoreFromKeypair(identity);

  const lightDidDetails = getLightDidFromKeypair(identity);

  const { extrinsic, did } = await DidUtils.upgradeDid(
    lightDidDetails,
    identity.address,
    keystore,
  );

  const blockchain = await BlockchainApiConnection.getConnectionOrConnect();
  const tx = await blockchain.signTx(identity, extrinsic);
  return { extrinsic: tx, did };
}

export async function getFee(): Promise<BN> {
  const fakeIdentity = makeKeyring().createFromUri('//Alice');
  const blockchain = await BlockchainApiConnection.getConnectionOrConnect();

  const { extrinsic } = await getSignedTransaction(fakeIdentity);

  const { partialFee } = await blockchain.api.rpc.payment.queryInfo(
    extrinsic.toHex(),
  );
  return partialFee;
}

const currentTx: Record<string, DidTransaction> = {};

export async function sign(
  identity: Identity,
  password: string,
): Promise<string> {
  const sdkIdentity = await decryptIdentity(identity.address, password);
  const { extrinsic, did } = await getSignedTransaction(sdkIdentity);

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
