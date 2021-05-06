import { browser } from 'webextension-polyfill-ts';
import BN from 'bn.js';

import { makeTransfer } from '@kiltprotocol/core/lib/balance/Balance.chain';
import { BlockchainUtils } from '@kiltprotocol/chain-helpers';

import { decryptAccount } from '../../utilities/accounts/accounts';
import { createOnMessage } from '../createOnMessage';

const transferRequest = 'transferRequest';

interface TransferRequest {
  address: string;
  recipient: string;
  amount: string;
  tip: string;
  password: string;
}

export async function sendTransferMessage({
  address,
  recipient,
  amount,
  tip,
  password,
}: {
  address: string;
  recipient: string;
  amount: BN;
  tip: BN;
  password: string;
}): Promise<void> {
  await browser.runtime.sendMessage({
    type: transferRequest,
    data: {
      address,
      recipient,
      amount: amount.toString(),
      tip: tip.toString(),
      password,
    } as TransferRequest,
  });
}

export const onTransferRequest = createOnMessage<TransferRequest, string>(
  transferRequest,
);

export async function transferMessageListener(
  data: TransferRequest,
): Promise<string> {
  const { address, recipient, amount, password } = data;
  try {
    const identity = await decryptAccount(address, password);

    // TODO: include the tip in the transaction when the SDK enables it
    // https://github.com/KILTprotocol/sdk-js/pull/378
    const tx = await makeTransfer(identity, recipient, new BN(amount));
    await BlockchainUtils.submitTxWithReSign(tx, identity, {
      resolveOn: BlockchainUtils.IS_IN_BLOCK,
    });

    return ''; // empty string = no error
  } catch (error) {
    console.error(error);
    return error.message;
  }
}
