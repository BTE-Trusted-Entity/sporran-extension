import { SignerPayloadJSON } from '@polkadot/types/types/extrinsic';
import { BlockchainApiConnection } from '@kiltprotocol/chain-helpers';

import { BrowserChannel } from '../../channels/base/BrowserChannel/BrowserChannel';
import { decryptAccount } from '../../utilities/accounts/accounts';

interface SignTxInput {
  password: string;
  payload: SignerPayloadJSON;
}

interface SignTxOutput {
  id: number;
  signature: string;
}

export const signTxChannel = new BrowserChannel<SignTxInput, SignTxOutput>(
  'signTx',
);

let id = 0;

export function initBackgroundSignTxChannel(): void {
  signTxChannel.produce(async ({ password, payload }) => {
    const { api } = await BlockchainApiConnection.getConnectionOrConnect();

    const { signKeyringPair } = await decryptAccount(payload.address, password);

    const params = { version: payload.version };
    const { signature } = api.registry
      .createType('ExtrinsicPayload', payload, params)
      .sign(signKeyringPair);

    id += 1;
    return { signature, id };
  });
}
