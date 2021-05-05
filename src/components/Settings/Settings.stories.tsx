import { Meta } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';

import { AccountsProviderMock } from '../../utilities/accounts/AccountsProvider.mock';
import menuStyles from '../Menu/Menu.module.css';

import { Settings } from './Settings';

export default {
  title: 'Components/Settings',
  component: Settings,
  decorators: [
    (Story) => (
      <div className={menuStyles.wrapper} style={{ float: 'right' }}>
        <Story />
      </div>
    ),
  ],
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
