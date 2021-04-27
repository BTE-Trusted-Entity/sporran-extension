import { browser } from 'webextension-polyfill-ts';
import BN from 'bn.js';
import { BlockchainApiConnection } from '@kiltprotocol/chain-helpers';

import { FeeRequest, MessageType } from '../MessageType';

const fallbackAddressForFee =
  '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire';

export function feeListener(message: FeeRequest): Promise<string> | void {
  if (message.type !== MessageType.feeRequest) {
    return;
  }
  return (async () => {
    const { api } = await BlockchainApiConnection.getConnectionOrConnect();
    const tx = api.tx.balances.transfer(
      message.data.recipient || fallbackAddressForFee,
      new BN(message.data.amount, 10),
    );
    const { partialFee } = await api.rpc.payment.queryInfo(tx.toHex());
    return partialFee.toString(10);
  })();
}

export function initFeeMessages(): void {
  browser.runtime.onMessage.addListener(feeListener);
}
