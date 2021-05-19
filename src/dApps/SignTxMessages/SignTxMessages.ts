import { browser } from 'webextension-polyfill-ts';
import { SignerPayloadJSON } from '@polkadot/types/types/extrinsic';
import { BlockchainApiConnection } from '@kiltprotocol/chain-helpers';

import { createOnMessage } from '../../connection/createOnMessage/createOnMessage';
import { decryptAccount } from '../../utilities/accounts/accounts';

const request = 'signTxRequest';

interface SignTxRequest {
  password: string;
  payload: SignerPayloadJSON;
}

interface SignTxResponse {
  id: number;
  signature: string;
}

export async function getSignTxResult(
  data: SignTxRequest,
): Promise<SignTxResponse> {
  return browser.runtime.sendMessage({
    type: request,
    data,
  });
}

export const produceSignTxResult =
  createOnMessage<SignTxRequest, SignTxResponse>(request);

let id = 0;

export function initSignTxMessages(): void {
  produceSignTxResult(async ({ password, payload }) => {
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
