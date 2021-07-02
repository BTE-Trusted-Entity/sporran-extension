import {
  BlockchainApiConnection,
  BlockchainUtils,
} from '@kiltprotocol/chain-helpers';
import { getBalances } from '@kiltprotocol/core/lib/balance/Balance.chain';
import BN from 'bn.js';

import { decryptIdentity } from '../../utilities/identities/identities';
import { transformBalances } from '../../utilities/transformBalances/transformBalances';

import { BrowserChannel } from '../base/BrowserChannel/BrowserChannel';

interface VestInput {
  address: string;
  password: string;
}

type VestingFeeOutput = BN;

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
  VestingFeeOutput,
  void,
  JsonVestingFeeOutput
>('vestingFee', false, transform);

export async function getVestingFee(): Promise<VestingFeeOutput> {
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

  const identity = await decryptIdentity(address, password);

  const tx = api.tx.vesting.vest();

  const { partialFee } = await api.rpc.payment.queryInfo(tx.toHex());

  const rawBalances = await getBalances(address);

  const balance = transformBalances(rawBalances);

  if (balance.usableForFees.lt(partialFee)) {
    throw new Error(insufficientFunds);
  }

  await BlockchainUtils.signAndSubmitTx(tx, identity, {
    resolveOn: BlockchainUtils.IS_IN_BLOCK,
  });
}

export function initBackgroundVestChannel(): void {
  vestChannel.produce(vest);
}
