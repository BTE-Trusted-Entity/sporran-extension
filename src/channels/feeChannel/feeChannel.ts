import { BlockchainApiConnection } from '@kiltprotocol/chain-helpers';
import { Identity } from '@kiltprotocol/core';
import BN from 'bn.js';

import { BrowserChannel } from '../base/BrowserChannel/BrowserChannel';

interface FeeInput {
  recipient: string;
  amount: BN;
  tip: BN;
}

type FeeOutput = BN;

interface JsonFeeInput {
  recipient: string;
  amount: string;
  tip: string;
}

type JsonFeeOutput = string;

const transform = {
  inputToJson: ({ amount, tip, recipient }: FeeInput) => ({
    amount: amount.toString(),
    tip: tip.toString(),
    recipient,
  }),
  jsonToInput: ({ amount, tip, recipient }: JsonFeeInput) => ({
    amount: new BN(amount),
    tip: new BN(tip),
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
  const blockchain = await BlockchainApiConnection.getConnectionOrConnect();
  const { api } = blockchain;

  const tx = api.tx.balances.transfer(
    input.recipient || fallbackAddressForFee,
    input.amount,
  );

  // Including any signature increases the transaction size and the fee
  const fakeIdentity = Identity.buildFromURI('//Alice');
  const signedTx = await blockchain.signTx(fakeIdentity, tx, input.tip);

  const { partialFee } = await api.rpc.payment.queryInfo(signedTx.toHex());
  return partialFee;
}

export function initBackgroundFeeChannel(): void {
  feeChannel.produce(getFee);
}
