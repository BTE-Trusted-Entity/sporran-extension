import { Meta } from '@storybook/react';

import { Settings } from './Settings';
import { AccountsProviderMock } from '../../testing/AccountsProviderMock';
import { MemoryRouter } from 'react-router-dom';

export default {
  title: 'Components/Settings',
  component: Settings,
} as Meta;

export function NoAccounts(): JSX.Element {
  return (
    <AccountsProviderMock accounts={{}}>
      <Settings />
    </AccountsProviderMock>
  );
}

export function WithAccounts(): JSX.Element {
  return (
    <MemoryRouter initialEntries={['/account/foo']}>
      <Settings />
    </MemoryRouter>
  );
}
