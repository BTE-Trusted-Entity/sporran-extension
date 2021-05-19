import { browser } from 'webextension-polyfill-ts';
import BN from 'bn.js';
import { listenToBalanceChanges } from '@kiltprotocol/core/lib/balance/Balance.chain';

import { createOnMessage } from '../createOnMessage/createOnMessage';

export const balanceChangeRequest = 'balanceChangeRequest';
export const balanceChangeResponse = 'balanceChangeResponse';

interface Balance {
  free: BN;
  reserved: BN;
  miscFrozen: BN;
  feeFrozen: BN;
}

export interface ComputedBalance {
  free: string;
  bonded: string;
  locked: string;
  total: string;
}

export interface BalanceChangeRequest {
  address: string;
}

export interface BalanceChangeResponse {
  address: string;
  balance: ComputedBalance;
}

export async function sendBalanceChangeRequest(address: string): Promise<void> {
  await browser.runtime.sendMessage({
    type: balanceChangeRequest,
    data: { address } as BalanceChangeRequest,
  });
}

async function sendBalanceChangeResponse(
  address: string,
  balance: ComputedBalance,
) {
  await browser.runtime.sendMessage({
    type: balanceChangeResponse,
    data: { address, balance },
  });
}

export const onBalanceChangeRequest =
  createOnMessage<BalanceChangeRequest>(balanceChangeRequest);

export const onBalanceChangeResponse = createOnMessage<BalanceChangeResponse>(
  balanceChangeResponse,
);

export async function onBalanceChange(
  address: string,
  balance: Balance,
): Promise<void> {
  const { free, reserved, miscFrozen, feeFrozen } = balance;
  const locked = miscFrozen.add(feeFrozen);
  const total = free.add(reserved).add(locked);

  await sendBalanceChangeResponse(address, {
    free: free.toString(),
    bonded: reserved.toString(),
    locked: locked.toString(),
    total: total.toString(),
  });
}

export async function balanceMessageListener(
  data: BalanceChangeRequest,
): Promise<void> {
  await listenToBalanceChanges(data.address, onBalanceChange);
}
