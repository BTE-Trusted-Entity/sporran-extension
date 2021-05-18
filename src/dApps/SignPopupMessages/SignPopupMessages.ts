import { SignerPayloadJSON } from '@polkadot/types/types/extrinsic';
import { createSendWindowMessage } from '../../connection/createSendWindowMessage/createSendWindowMessage';
import { createOnWindowMessage } from '../../connection/createOnWindowMessage/createOnWindowMessage';
import { createGetResult } from '../../connection/createGetResult/createGetResult';

const request = 'sporranExtension.injectedScript.signRequest';
const response = 'sporranExtension.injectedScript.signResponse';

interface SignPopupRequest {
  dAppName: string;
  payload: SignerPayloadJSON;
}

interface SignPopupResponse {
  id: number;
  signature: string;
}

const sendSignPopupRequest = createSendWindowMessage<SignPopupRequest>(request);

const onSignPopupRequest = createOnWindowMessage<SignPopupRequest>(request);

const sendSignPopupResponse =
  createSendWindowMessage<SignPopupResponse>(response);

const onSignPopupResponse = createOnWindowMessage<SignPopupResponse>(response);

export const getSignPopupResult = createGetResult<
  SignPopupRequest,
  SignPopupResponse
>(sendSignPopupRequest, onSignPopupResponse);

export function produceSignPopupResult(
  callback: (request: SignPopupRequest) => Promise<SignPopupResponse>,
): () => void {
  return onSignPopupRequest(async (request) => {
    const result = await callback(request);
    sendSignPopupResponse(result);
  });
}
