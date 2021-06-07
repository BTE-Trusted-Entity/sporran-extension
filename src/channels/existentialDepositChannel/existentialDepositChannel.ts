import { BlockchainApiConnection } from '@kiltprotocol/chain-helpers';
import BN from 'bn.js';

import { BrowserChannel } from '../base/BrowserChannel/BrowserChannel';

type ExistentialInput = void;

type ExistentialOutput = BN;

type JsonExistentialInput = void;

type JsonExistentialOutput = string;

const transform = {
  outputToJson: (output: BN) => output.toString(),
  jsonToOutput: (output: string) => new BN(output),
};

export const existentialDepositChannel = new BrowserChannel<
  ExistentialInput,
  ExistentialOutput,
  JsonExistentialInput,
  JsonExistentialOutput
>('existential', false, transform);

export async function getExistentialDeposit(): Promise<BN> {
  const { api } = await BlockchainApiConnection.getConnectionOrConnect();

  return api.consts.balances.existentialDeposit;
}

export function initBackgroundExistentialDepositChannel(): void {
  existentialDepositChannel.produce(getExistentialDeposit);
}
