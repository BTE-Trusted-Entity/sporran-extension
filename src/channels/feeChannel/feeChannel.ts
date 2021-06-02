import { BlockchainApiConnection } from '@kiltprotocol/chain-helpers';
import BN from 'bn.js';

import { BrowserChannel } from '../base/BrowserChannel/BrowserChannel';

interface FeeInput {
  recipient: string;
  amount: BN;
}

type FeeOutput = BN;

interface JsonFeeInput {
  recipient: string;
  amount: string;
}

type JsonFeeOutput = string;

const transform = {
  inputToJson: ({ amount, recipient }: FeeInput) => ({
    amount: amount.toString(),
    recipient,
  }),
  jsonToInput: ({ amount, recipient }: JsonFeeInput) => ({
    amount: new BN(amount),
    recipient,
  }),
  outputToJson: (output: BN) => output.toString(),
  jsonToOutput: (output: string) => new BN(output),
};

export const feeChannel = new BrowserChannel<
  FeeInput,
  FeeOutput,
  JsonFeeInput,
  JsonFeeOutput
>('fee', false, transform);

const fallbackAddressForFee =
  '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire';

export async function getFee(input: FeeInput): Promise<BN> {
  const { api } = await BlockchainApiConnection.getConnectionOrConnect();

  const tx = api.tx.balances.transfer(
    input.recipient || fallbackAddressForFee,
    input.amount,
  );

  const { partialFee } = await api.rpc.payment.queryInfo(tx.toHex());
  return partialFee;
}

export function initBackgroundFeeChannel(): void {
  feeChannel.produce(getFee);
}
