import BN from 'bn.js';
import { KeyringPair } from '@polkadot/keyring/types';
import { SubmittableExtrinsic } from '@kiltprotocol/types';
import {
  BlockchainApiConnection,
  BlockchainUtils,
} from '@kiltprotocol/chain-helpers';
import { DidUtils } from '@kiltprotocol/did';

import {
  decryptIdentity,
  getIdentityDidEncryptionFromKeypair,
  Identity,
  makeKeyring,
} from '../identities/identities';

export async function getDeposit(): Promise<BN> {
  const blockchain = await BlockchainApiConnection.getConnectionOrConnect();
  // TODO: return blockchain.api.consts.did.deposit
  return blockchain.api.consts.balances.existentialDeposit;
}

async function getSignedTransaction(
  identity: KeyringPair,
): Promise<SubmittableExtrinsic> {
  const { didDetails, keystore } = await getIdentityDidEncryptionFromKeypair(
    identity,
  );

  // TODO: const tx = await DidUtils.upgradeDid(didDetails, keystore);
  const tx = await (
    DidUtils as typeof DidUtils & {
      upgradeDid: (
        a: typeof didDetails,
        b: typeof keystore,
      ) => SubmittableExtrinsic;
    }
  ).upgradeDid(didDetails, keystore);

  const blockchain = await BlockchainApiConnection.getConnectionOrConnect();
  return blockchain.signTx(identity, tx);
}

export async function getFee(): Promise<BN> {
  const fakeIdentity = makeKeyring().createFromUri('//Alice');
  const blockchain = await BlockchainApiConnection.getConnectionOrConnect();

  // TODO: remove to use real values
  return blockchain.api.consts.balances.existentialDeposit;

  const signedTx = await getSignedTransaction(fakeIdentity);

  const { partialFee } = await blockchain.api.rpc.payment.queryInfo(
    signedTx.toHex(),
  );
  return partialFee;
}

const currentTx: Record<string, SubmittableExtrinsic> = {};

export async function sign(
  identity: Identity,
  password: string,
): Promise<string> {
  const sdkIdentity = await decryptIdentity(identity.address, password);
  const signedTx = await getSignedTransaction(sdkIdentity);

  const hash = signedTx.hash.toHex();
  currentTx[hash] = signedTx;
  return hash;
}

export async function submit(hash: string): Promise<void> {
  await BlockchainUtils.submitSignedTx(currentTx[hash], {
    resolveOn: BlockchainUtils.IS_FINALIZED,
  });
  delete currentTx[hash];
}
