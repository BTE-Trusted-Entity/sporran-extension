import BN from 'bn.js';

import { makeTransfer } from '@kiltprotocol/core/lib/balance/Balance.chain';
import {
  BlockchainUtils,
  BlockchainApiConnection,
} from '@kiltprotocol/chain-helpers';
import { SubmittableExtrinsic } from '@polkadot/api/types';

import { decryptIdentity } from '../../utilities/identities/identities';
import { BrowserChannel } from '../base/BrowserChannel/BrowserChannel';

const currentTx: Record<string, SubmittableExtrinsic<'promise'>> = {};

interface signTransferInput {
  address: string;
  recipient: string;
  amount: BN;
  tip: BN;
  password: string;
}

interface signTransferOutput {
  hash: string;
}

interface JsonSignTransferInput {
  address: string;
  recipient: string;
  amount: string;
  tip: string;
  password: string;
}

const transform = {
  inputToJson: (input: signTransferInput) => ({
    ...input,
    amount: input.amount.toString(),
    tip: input.tip.toString(),
  }),
  jsonToInput: (input: JsonSignTransferInput) => ({
    ...input,
    amount: new BN(input.amount),
    tip: new BN(input.tip),
  }),
};

export const signTransferChannel = new BrowserChannel<
  signTransferInput,
  signTransferOutput,
  JsonSignTransferInput
>('signTransfer', false, transform);

export async function signTransfer(
  input: signTransferInput,
): Promise<signTransferOutput> {
  const { address, recipient, amount, password, tip } = input;

  const blockchain = await BlockchainApiConnection.getConnectionOrConnect();

  const sdkIdentity = await decryptIdentity(address, password);

  const tx = await makeTransfer(recipient, amount);

  const signedTx = await blockchain.signTx(sdkIdentity, tx, tip);
  const hash = signedTx.hash.toHex();
  currentTx[hash] = signedTx;

  return { hash };
}

export function initBackgroundSignTransferChannel(): void {
  signTransferChannel.produce(signTransfer);
}

export const submitTransferChannel = new BrowserChannel<string>(
  'submitTransfer',
);

export async function submitTransfer(hash: string): Promise<void> {
  await BlockchainUtils.submitSignedTx(currentTx[hash], {
    resolveOn: BlockchainUtils.IS_FINALIZED,
    rejectOn: BlockchainUtils.IS_ERROR,
  });
  delete currentTx[hash];
}

export function initBackgroundSubmitTransferChannel(): void {
  submitTransferChannel.produce(submitTransfer);
}
