import { browser } from 'webextension-polyfill-ts';
import BN from 'bn.js';
import { listenToBalanceChanges } from '@kiltprotocol/core/lib/balance/Balance.chain';

export const BalanceMessageType = {
  balanceChangeRequest: 'balanceChangeRequest',
  balanceChangeResponse: 'balanceChangeResponse',
};

export interface BalanceChangeRequest {
  type: typeof BalanceMessageType.balanceChangeRequest;
  data: { address: string };
}

export interface BalanceChangeResponse {
  type: typeof BalanceMessageType.balanceChangeResponse;
  data: {
    address: string;
    balance: string;
  };
}

export async function onBalanceChange(
  address: string,
  balance: BN,
): Promise<void> {
  await browser.runtime.sendMessage({
    type: BalanceMessageType.balanceChangeResponse,
    data: {
      address,
      balance: balance.toString(),
    },
  });
}

export function balanceMessageListener(message: BalanceChangeRequest): void {
  if (message.type === BalanceMessageType.balanceChangeRequest) {
    (async () => {
      await listenToBalanceChanges(message.data.address, onBalanceChange);
    })();
  }
}

export async function sendBalanceChangeRequest(address: string): Promise<void> {
  await browser.runtime.sendMessage({
    type: BalanceMessageType.balanceChangeRequest,
    data: { address },
  } as BalanceChangeRequest);
}
