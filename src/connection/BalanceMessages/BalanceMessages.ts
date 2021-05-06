import { browser } from 'webextension-polyfill-ts';
import BN from 'bn.js';
import { listenToBalanceChanges } from '@kiltprotocol/core/lib/balance/Balance.chain';

import { createOnMessage } from '../createOnMessage';

export const balanceChangeRequest = 'balanceChangeRequest';
export const balanceChangeResponse = 'balanceChangeResponse';

export interface BalanceChangeRequest {
  address: string;
}

export interface BalanceChangeResponse {
  address: string;
  balance: string;
}

export async function sendBalanceChangeRequest(address: string): Promise<void> {
  await browser.runtime.sendMessage({
    type: balanceChangeRequest,
    data: { address } as BalanceChangeRequest,
  });
}

async function sendBalanceChangeResponse(address: string, balance: string) {
  await browser.runtime.sendMessage({
    type: balanceChangeResponse,
    data: { address, balance },
  });
}

export const onBalanceChangeRequest = createOnMessage<BalanceChangeRequest>(
  balanceChangeRequest,
);

export const onBalanceChangeResponse = createOnMessage<BalanceChangeResponse>(
  balanceChangeResponse,
);

export async function onBalanceChange(
  address: string,
  balance: BN,
): Promise<void> {
  await sendBalanceChangeResponse(address, balance.toString());
}

export async function balanceMessageListener(
  data: BalanceChangeRequest,
): Promise<void> {
  await listenToBalanceChanges(data.address, onBalanceChange);
}
