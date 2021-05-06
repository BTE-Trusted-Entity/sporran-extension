import { browser } from 'webextension-polyfill-ts';
import BN from 'bn.js';
import { listenToBalanceChanges } from '@kiltprotocol/core/lib/balance/Balance.chain';

import { createOnMessage } from '../createOnMessage';

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

export async function sendBalanceChangeRequest(address: string): Promise<void> {
  await browser.runtime.sendMessage({
    type: BalanceMessageType.balanceChangeRequest,
    data: { address },
  } as BalanceChangeRequest);
}

async function sendBalanceChangeResponse(address: string, balance: string) {
  await browser.runtime.sendMessage({
    type: BalanceMessageType.balanceChangeResponse,
    data: { address, balance },
  });
}

export async function onBalanceChange(
  address: string,
  balance: BN,
): Promise<void> {
  await sendBalanceChangeResponse(address, balance.toString());
}

export const onBalanceChangeRequest = createOnMessage<BalanceChangeRequest>(
  BalanceMessageType.balanceChangeRequest,
);

export const onBalanceChangeResponse = createOnMessage<BalanceChangeResponse>(
  BalanceMessageType.balanceChangeResponse,
);

export async function balanceMessageListener(
  data: BalanceChangeRequest['data'],
): Promise<void> {
  await listenToBalanceChanges(data.address, onBalanceChange);
}
