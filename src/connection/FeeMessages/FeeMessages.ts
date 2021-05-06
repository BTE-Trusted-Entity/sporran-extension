import { BlockchainApiConnection } from '@kiltprotocol/chain-helpers';
import BN from 'bn.js';
import { browser } from 'webextension-polyfill-ts';

export const FeeMessageType = {
  feeRequest: 'feeRequest',
};

export interface FeeRequest {
  type: typeof FeeMessageType.feeRequest;
  data: {
    recipient: string;
    amount: string;
  };
}

export async function getFee(amount: BN, recipient: string): Promise<BN> {
  const feeString = await browser.runtime.sendMessage({
    type: FeeMessageType.feeRequest,
    data: {
      amount: amount.toString(),
      recipient,
    },
  } as FeeRequest);

  return new BN(feeString);
}

const fallbackAddressForFee =
  '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire';

export function feeMessageListener(
  message: FeeRequest,
): Promise<string> | void {
  if (message.type !== FeeMessageType.feeRequest) {
    return;
  }
  return (async () => {
    const { api } = await BlockchainApiConnection.getConnectionOrConnect();
    const tx = api.tx.balances.transfer(
      message.data.recipient || fallbackAddressForFee,
      new BN(message.data.amount),
    );
    const { partialFee } = await api.rpc.payment.queryInfo(tx.toHex());
    return partialFee.toString();
  })();
}
