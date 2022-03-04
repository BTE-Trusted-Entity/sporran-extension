import BN from 'bn.js';

import { Balance } from '@kiltprotocol/core';
import {
  BlockchainUtils,
  BlockchainApiConnection,
} from '@kiltprotocol/chain-helpers';
import { SubmittableExtrinsic } from '@kiltprotocol/types';
import { KeyringPair } from '@polkadot/keyring/types';

const currentTx: Record<string, SubmittableExtrinsic> = {};

interface Input {
  recipient: string;
  amount: BN;
  tip: BN;
  keypair: KeyringPair;
}

export async function signTransfer(input: Input): Promise<string> {
  const { recipient, amount, keypair, tip } = input;

  const blockchain = await BlockchainApiConnection.getConnectionOrConnect();

  const tx = await Balance.getTransferTx(recipient, amount);

  const signedTx = await blockchain.signTx(keypair, tx, tip);
  const hash = signedTx.hash.toHex();
  currentTx[hash] = signedTx;

  return hash;
}

export async function submitTransfer(hash: string): Promise<void> {
  await BlockchainUtils.submitSignedTx(currentTx[hash], {
    resolveOn: BlockchainUtils.IS_FINALIZED,
  });
  delete currentTx[hash];
}
