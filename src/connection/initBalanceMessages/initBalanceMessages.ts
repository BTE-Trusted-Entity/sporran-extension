import { browser } from 'webextension-polyfill-ts';
import BN from 'bn.js';
import { listenToBalanceChanges } from '@kiltprotocol/core/lib/balance/Balance.chain';

import { MessageType, BalanceChangeRequest } from '../MessageType';

export async function onChange(address: string, balance: BN): Promise<void> {
  await browser.runtime.sendMessage({
    type: MessageType.balanceChangeResponse,
    data: {
      address,
      balance: balance.toJSON(),
    },
  });
}

export function balanceListener(message: BalanceChangeRequest): void {
  if (message.type === MessageType.balanceChangeRequest) {
    (async () => {
      await listenToBalanceChanges(message.data.address, onChange);
    })();
  }
}

export function initBalanceMessages(): void {
  browser.runtime.onMessage.addListener(balanceListener);
}
