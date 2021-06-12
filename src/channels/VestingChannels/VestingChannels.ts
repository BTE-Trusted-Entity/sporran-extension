import {
  BlockchainApiConnection,
  BlockchainUtils,
} from '@kiltprotocol/chain-helpers';
import { getBalances } from '@kiltprotocol/core/lib/balance/Balance.chain';
import BN from 'bn.js';

import { decryptAccount } from '../../utilities/accounts/accounts';

import { BrowserChannel } from '../base/BrowserChannel/BrowserChannel';

interface VestInput {
  address: string;
  password: string;
}

type vestingFeeOutput = BN;

type JsonVestingFeeOutput = string;

export const hasVestedFundsChannel = new BrowserChannel<string, boolean>(
  'hasVestedFunds',
);

export async function hasVestedFunds(address: string): Promise<boolean> {
  const { api } = await BlockchainApiConnection.getConnectionOrConnect();
  const { isSome } = await api.query.vesting.vesting(address);
  return isSome;
}

export function initBackgroundHasVestedFundsChannel(): void {
  hasVestedFundsChannel.produce(hasVestedFunds);
}

const transform = {
  outputToJson: (output: BN) => output.toString(),
  jsonToOutput: (output: string) => new BN(output),
};

export const vestingFeeChannel = new BrowserChannel<
  void,
  vestingFeeOutput,
  void,
  JsonVestingFeeOutput
>('vestingFee', false, transform);

export async function getVestingFee(): Promise<vestingFeeOutput> {
  const { api } = await BlockchainApiConnection.getConnectionOrConnect();

  const tx = api.tx.vesting.vest();

  const { partialFee } = await api.rpc.payment.queryInfo(tx.toHex());
  return partialFee;
}

export function initBackgroundVestingFeeChannel(): void {
  vestingFeeChannel.produce(getVestingFee);
}

export const vestChannel = new BrowserChannel<VestInput>('vest');

export const insufficientFunds = 'Insufficient funds';

export async function vest({ address, password }: VestInput): Promise<void> {
  const { api } = await BlockchainApiConnection.getConnectionOrConnect();

  const identity = await decryptAccount(address, password);

  const tx = api.tx.vesting.vest();

  const { partialFee } = await api.rpc.payment.queryInfo(tx.toHex());

  const balance = await getBalances(address);

  if (balance.free.sub(partialFee).isNeg()) {
    throw new Error(insufficientFunds);
  }

  const existentialDeposit = api.consts.balances.existentialDeposit; // 1e15

  const totalBalance = balance.free.add(balance.reserved); // 1.234e15

  const remainingBalance = totalBalance.sub(partialFee); // 0.734e15

  const belowExistential = remainingBalance.lt(existentialDeposit); // true

  const useableRemainingBalance = remainingBalance.sub(balance.reserved); // 0.726e15

  const tip =
    belowExistential && useableRemainingBalance.gtn(0)
      ? useableRemainingBalance
      : new BN(0);

  await BlockchainUtils.signAndSubmitTx(tx, identity, {
    resolveOn: BlockchainUtils.IS_IN_BLOCK,
    rejectOn: BlockchainUtils.IS_ERROR,
    tip,
  });
}

export function initBackgroundVestChannel(): void {
  vestChannel.produce(vest);
}
