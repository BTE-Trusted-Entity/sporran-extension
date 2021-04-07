import { browser } from 'webextension-polyfill-ts';
import BN from 'bn.js';
import { listenToBalanceChanges } from '@kiltprotocol/core/lib/balance/Balance.chain';

import { MessageType, BalanceChangeRequest } from '../MessageType';

export async function onChange(address: string, balance: BN): Promise<void> {
  // Using toString(16) as in bn@4 toJSON, because in bn@5 it is toString(16,2)
  // (https://github.com/indutny/bn.js/pull/164/files)
  // and is incompatible with the mix of versions Kilt SDK and polkadot are using.
  // Hoping for a proper fix upstream, but this works around the issue.
  await browser.runtime.sendMessage({
    type: MessageType.balanceChangeResponse,
    data: {
      address,
      balance: balance.toString(16),
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
