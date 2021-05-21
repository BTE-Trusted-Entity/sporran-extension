import BN from 'bn.js';

import { makeTransfer } from '@kiltprotocol/core/lib/balance/Balance.chain';
import { BlockchainUtils } from '@kiltprotocol/chain-helpers';

import { decryptAccount } from '../../utilities/accounts/accounts';
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

type TransferOutput = string;

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
  TransferOutput,
  JsonTransferInput
>('transfer', false, transform);

export async function transfer(input: TransferInput): Promise<string> {
  const { address, recipient, amount, password, tip } = input;
  try {
    const identity = await decryptAccount(address, password);

    const tx = await makeTransfer(recipient, amount);
    await BlockchainUtils.signAndSubmitTx(tx, identity, {
      resolveOn: BlockchainUtils.IS_IN_BLOCK,
      tip,
    });

    return ''; // empty string = no error
  } catch (error) {
    console.error(error);
    return error.message;
  }
}

export function initBackgroundTransferChannel(): void {
  transferChannel.produce(transfer);
}
