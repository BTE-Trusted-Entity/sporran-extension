import BN from 'bn.js';
import { KeyringPair } from '@polkadot/keyring/types';
import { IDidDetails, SubmittableExtrinsic } from '@kiltprotocol/types';
import {
  BlockchainApiConnection,
  BlockchainUtils,
} from '@kiltprotocol/chain-helpers';
import { DidChain, FullDidCreationBuilder } from '@kiltprotocol/did';

import {
  getKeystoreFromKeypair,
  Identity,
  getLightDidFromKeypair,
  makeKeyring,
} from '../identities/identities';
import { getDidEncryptionKey, parseDidUri } from '../did/did';

interface DidTransaction {
  extrinsic: SubmittableExtrinsic;
  did: IDidDetails['did'];
}

export async function getDeposit(): Promise<BN> {
  return DidChain.queryDepositAmount();
}

async function getSignedTransaction(
  identity: KeyringPair,
): Promise<DidTransaction> {
  const keystore = await getKeystoreFromKeypair(identity);

  const lightDidDetails = getLightDidFromKeypair(identity);
  const { fullDid: did } = parseDidUri(lightDidDetails.did);

  const blockchain = await BlockchainApiConnection.getConnectionOrConnect();
  const encryptionKey = getDidEncryptionKey(lightDidDetails);

  const extrinsic = await new FullDidCreationBuilder(
    blockchain.api,
    lightDidDetails.authenticationKey,
  )
    .addEncryptionKey(encryptionKey)
    .consume(keystore, identity.address);

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
  sdkIdentity: KeyringPair,
): Promise<string> {
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
