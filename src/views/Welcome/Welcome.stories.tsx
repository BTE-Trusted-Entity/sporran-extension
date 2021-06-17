import { Meta } from '@storybook/react';

import { AccountsProviderMock } from '../../utilities/accounts/AccountsProvider.mock';

import { Welcome } from './Welcome';

export default {
  title: 'Views/Welcome',
  component: Welcome,
} as Meta;

export function NoAccounts(): JSX.Element {
  return (
    <AccountsProviderMock accounts={{}}>
      <Welcome />
    </AccountsProviderMock>
  );
}

export function HasAccounts(): JSX.Element {
  return <Welcome again />;
}
