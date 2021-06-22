import BN from 'bn.js';

import { makeTransfer } from '@kiltprotocol/core/lib/balance/Balance.chain';
import { BlockchainUtils } from '@kiltprotocol/chain-helpers';

import { decryptIdentity } from '../../utilities/identities/identities';
import { BrowserChannel } from '../base/BrowserChannel/BrowserChannel';

interface TransferInput {
  address: string;
  recipient: string;
  amount: BN;
  tip: BN;
  password: string;
}

interface JsonTransferInput {
  address: string;
  recipient: string;
  amount: string;
  tip: string;
  password: string;
}

const transform = {
  inputToJson: (input: TransferInput) => ({
    ...input,
    amount: input.amount.toString(),
    tip: input.tip.toString(),
  }),
  jsonToInput: (input: JsonTransferInput) => ({
    ...input,
    amount: new BN(input.amount),
    tip: new BN(input.tip),
  }),
};

export const transferChannel = new BrowserChannel<
  TransferInput,
  void,
  JsonTransferInput
>('transfer', false, transform);

export async function transfer(input: TransferInput): Promise<void> {
  const { address, recipient, amount, password, tip } = input;

  const blockchainIdentity = await decryptIdentity(address, password);

  const tx = await makeTransfer(recipient, amount);
  await BlockchainUtils.signAndSubmitTx(tx, blockchainIdentity, {
    resolveOn: BlockchainUtils.IS_FINALIZED,
    rejectOn: BlockchainUtils.IS_ERROR,
    tip,
  });
}

export function initBackgroundTransferChannel(): void {
  transferChannel.produce(transfer);
}
