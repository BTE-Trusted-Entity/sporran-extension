import BN from 'bn.js';

import { makeTransfer } from '@kiltprotocol/core/lib/balance/Balance.chain';
import {
  BlockchainUtils,
  BlockchainApiConnection,
} from '@kiltprotocol/chain-helpers';
import { SubmittableExtrinsic } from '@polkadot/api/types';

import { decryptIdentity } from '../identities/identities';

const currentTx: Record<string, SubmittableExtrinsic<'promise'>> = {};

interface SignTransferInput {
  address: string;
  recipient: string;
  amount: BN;
  tip: BN;
  password: string;
}

interface SignTransferOutput {
  hash: string;
}

export async function signTransfer(
  input: SignTransferInput,
): Promise<SignTransferOutput> {
  const { address, recipient, amount, password, tip } = input;

  const blockchain = await BlockchainApiConnection.getConnectionOrConnect();

  const sdkIdentity = await decryptIdentity(address, password);

  const tx = await makeTransfer(recipient, amount);

  const signedTx = await blockchain.signTx(sdkIdentity, tx, tip);
  const hash = signedTx.hash.toHex();
  currentTx[hash] = signedTx;

  return { hash };
}

export async function submitTransfer(hash: string): Promise<void> {
  await BlockchainUtils.submitSignedTx(currentTx[hash], {
    resolveOn: BlockchainUtils.IS_FINALIZED,
  });
  delete currentTx[hash];
}
