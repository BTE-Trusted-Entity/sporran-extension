import { browser } from 'webextension-polyfill-ts';
import {
  BlockchainApiConnection,
  BlockchainUtils,
} from '@kiltprotocol/chain-helpers';

import { createOnMessage } from '../createOnMessage/createOnMessage';
import { decryptAccount } from '../../utilities/accounts/accounts';

const hasVestedFundsRequest = 'hasVestedFundsRequest';
const vestRequest = 'vestRequest';

export interface HasVestedFundsRequest {
  address: string;
}

export interface VestRequest {
  address: string;
  password: string;
}

async function sendHasVestedFundsRequest(address: string) {
  return browser.runtime.sendMessage({
    type: hasVestedFundsRequest,
    data: { address } as HasVestedFundsRequest,
  });
}

async function sendVestRequest(address: string, password: string) {
  return browser.runtime.sendMessage({
    type: vestRequest,
    data: { address, password } as VestRequest,
  });
}

export async function hasVestedFunds(address: string): Promise<boolean> {
  return await sendHasVestedFundsRequest(address);
}

export async function vest(address: string, password: string): Promise<string> {
  return await sendVestRequest(address, password);
}

export const onHasVestedFundsRequest = createOnMessage<
  HasVestedFundsRequest,
  boolean
>(hasVestedFundsRequest);

export const onVestRequest = createOnMessage<VestRequest, string>(vestRequest);

export async function hasVestedFundsMessageListener(
  data: HasVestedFundsRequest,
): Promise<boolean> {
  const { api } = await BlockchainApiConnection.getConnectionOrConnect();
  const { isSome } = await api.query.vesting.vesting(data.address);
  return isSome;
}

export async function vestMessageListener(data: VestRequest): Promise<string> {
  const { address, password } = data;

  const { api } = await BlockchainApiConnection.getConnectionOrConnect();

  try {
    const identity = await decryptAccount(address, password);

    const tx = api.tx.vesting.vest();

    await BlockchainUtils.signAndSubmitTx(tx, identity, {
      resolveOn: BlockchainUtils.IS_IN_BLOCK,
    });
    return '';
  } catch (error) {
    console.error(error);
    return error.message;
  }
}
