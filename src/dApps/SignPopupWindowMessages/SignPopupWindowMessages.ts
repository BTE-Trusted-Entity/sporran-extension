import {
  SignerPayloadJSON,
  SignerResult,
} from '@polkadot/types/types/extrinsic';
import { createSendWindowMessage } from '../../connection/createSendWindowMessage/createSendWindowMessage';
import { createOnWindowMessage } from '../../connection/createOnWindowMessage/createOnWindowMessage';
import { createGetResult } from '../../connection/createGetResult/createGetResult';

const request = 'sporranExtension.injectedScript.signRequest';
const response = 'sporranExtension.injectedScript.signResponse';

interface SignPopupRequest {
  dAppName: string;
  payload: SignerPayloadJSON;
}

const sendSignPopupRequest = createSendWindowMessage<SignPopupRequest>(request);

const onSignPopupRequest = createOnWindowMessage<SignPopupRequest>(request);

const sendSignPopupResponse = createSendWindowMessage<SignerResult>(response);

const onSignPopupResponse = createOnWindowMessage<SignerResult>(response);

export const getSignPopupWindowResult = createGetResult<
  SignPopupRequest,
  SignerResult
>(sendSignPopupRequest, onSignPopupResponse);

export function produceSignPopupWindowResult(
  callback: (request: SignPopupRequest) => Promise<SignerResult>,
): () => void {
  return onSignPopupRequest(async (request) => {
    const result = await callback(request);
    sendSignPopupResponse(result);
  });
}
