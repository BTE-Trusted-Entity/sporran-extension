import { createOnWindowMessage } from '../createOnWindowMessage/createOnWindowMessage';
import { createSendWindowMessage } from '../createSendWindowMessage/createSendWindowMessage';
import { createGetResult } from '../createGetResult/createGetResult';

const request = 'sporranExtension.injectedScript.injectedEnableRequest';
const response = 'sporranExtension.injectedScript.injectedEnableResponse';

interface InjectedEnableRequest {
  name: string;
}

interface InjectedEnableResponse {
  authorized?: boolean;
}

const sendInjectedEnableRequest =
  createSendWindowMessage<InjectedEnableRequest>(request);

const onInjectedEnableRequest =
  createOnWindowMessage<InjectedEnableRequest>(request);

const sendInjectedEnableResponse =
  createSendWindowMessage<InjectedEnableResponse>(response);

const onInjectedEnableResponse =
  createOnWindowMessage<InjectedEnableResponse>(response);

export const getInjectedEnableResult = createGetResult<
  InjectedEnableRequest,
  InjectedEnableResponse
>(sendInjectedEnableRequest, onInjectedEnableResponse);

export function respondToInjectedEnableRequest(
  callback: (request: InjectedEnableRequest) => Promise<InjectedEnableResponse>,
): () => void {
  return onInjectedEnableRequest(async (request) => {
    const result = await callback(request);
    sendInjectedEnableResponse(result);
  });
}
