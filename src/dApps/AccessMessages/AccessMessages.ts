import { createOnWindowMessage } from '../../connection/createOnWindowMessage/createOnWindowMessage';
import { createSendWindowMessage } from '../../connection/createSendWindowMessage/createSendWindowMessage';
import { createGetResult } from '../../connection/createGetResult/createGetResult';

const request = 'sporranExtension.injectedScript.accessRequest';
const response = 'sporranExtension.injectedScript.accessResponse';

interface AccessRequest {
  dAppName: string;
}

interface AccessResponse {
  authorized?: boolean;
}

const sendAccessRequest = createSendWindowMessage<AccessRequest>(request);

const onAccessRequest = createOnWindowMessage<AccessRequest>(request);

const sendAccessResponse = createSendWindowMessage<AccessResponse>(response);

const onAccessResponse = createOnWindowMessage<AccessResponse>(response);

export const getAccessResult = createGetResult<AccessRequest, AccessResponse>(
  sendAccessRequest,
  onAccessResponse,
);

export function produceAccessResult(
  callback: (request: AccessRequest) => Promise<AccessResponse>,
): () => void {
  return onAccessRequest(async (request) => {
    const result = await callback(request);
    sendAccessResponse(result);
  });
}
