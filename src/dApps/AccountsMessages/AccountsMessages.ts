import { InjectedAccount } from '@polkadot/extension-inject/types';

import { createOnWindowMessage } from '../../connection/createOnWindowMessage/createOnWindowMessage';
import { createSendWindowMessage } from '../../connection/createSendWindowMessage/createSendWindowMessage';
import { createGetResult } from '../../connection/createGetResult/createGetResult';

const request = 'sporranExtension.injectedScript.accountsRequest';
const response = 'sporranExtension.injectedScript.accountsResponse';

interface AccountsRequest {
  name: string;
}

type AccountsResponse = InjectedAccount[];

const sendAccountsRequest = createSendWindowMessage<AccountsRequest>(request);

export const onAccountsRequest =
  createOnWindowMessage<AccountsRequest>(request);

export const sendAccountsResponse =
  createSendWindowMessage<AccountsResponse>(response);

const onAccountsResponse = createOnWindowMessage<AccountsResponse>(response);

export const getAccountsResult = createGetResult<
  AccountsRequest,
  AccountsResponse
>(sendAccountsRequest, onAccountsResponse);
