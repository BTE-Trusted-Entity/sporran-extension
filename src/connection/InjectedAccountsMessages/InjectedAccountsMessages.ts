import { InjectedAccount } from '@polkadot/extension-inject/types';

import { createOnWindowMessage } from '../createOnWindowMessage/createOnWindowMessage';
import { createSendWindowMessage } from '../createSendWindowMessage/createSendWindowMessage';
import { createGetResult } from '../createGetResult/createGetResult';

const request = 'sporranExtension.injectedScript.injectedAccountsRequest';
const response = 'sporranExtension.injectedScript.injectedAccountsResponse';

interface InjectedAccountsRequest {
  name: string;
}

type InjectedAccountsResponse = InjectedAccount[];

const sendInjectedAccountsRequest =
  createSendWindowMessage<InjectedAccountsRequest>(request);

export const onInjectedAccountsRequest =
  createOnWindowMessage<InjectedAccountsRequest>(request);

export const sendInjectedAccountsResponse =
  createSendWindowMessage<InjectedAccountsResponse>(response);

const onInjectedAccountsResponse =
  createOnWindowMessage<InjectedAccountsResponse>(response);

export const getInjectedAccountsResult = createGetResult<
  InjectedAccountsRequest,
  InjectedAccountsResponse
>(sendInjectedAccountsRequest, onInjectedAccountsResponse);
