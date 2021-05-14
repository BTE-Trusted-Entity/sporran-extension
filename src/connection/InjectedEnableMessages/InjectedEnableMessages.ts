import { createOnWindowMessage } from '../createOnWindowMessage/createOnWindowMessage';
import { createSendWindowMessage } from '../createSendWindowMessage/createSendWindowMessage';
import { createGetResult } from '../createGetResult/createGetResult';

const request = 'sporranExtension.injectedScript.injectedEnableRequest';
const response = 'sporranExtension.injectedScript.injectedEnableResponse';

interface InjectedEnableRequest {
  name: string;
}

type InjectedEnableResponse = {
  authorized?: boolean;
};

export const sendInjectedEnableRequest =
  createSendWindowMessage<InjectedEnableRequest>(request);

export const onInjectedEnableRequest =
  createOnWindowMessage<InjectedEnableRequest>(request);

export const sendInjectedEnableResponse =
  createSendWindowMessage<InjectedEnableResponse>(response);

export const onInjectedEnableResponse =
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
