import { browser } from 'webextension-polyfill-ts';
import BN from 'bn.js';
import { BlockchainUtils } from '@kiltprotocol/chain-helpers';
import { makeTransfer } from '@kiltprotocol/core/lib/balance/Balance.chain';

import { decryptAccount } from '../../utilities/accounts/accounts';
import { MessageType, TransferRequest } from '../MessageType';

export function transferListener(
  message: TransferRequest,
): Promise<string> | void {
  if (message.type !== MessageType.transferRequest) {
    return;
  }
  return (async () => {
    const { address, recipient, amount, password } = message.data;
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
  })();
}

export function initTransferMessages(): void {
  browser.runtime.onMessage.addListener(transferListener);
}
