import { Meta } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';

import { AccountsProviderMock } from '../../testing/AccountsProviderMock';
import menuStyles from '../Menu/Menu.module.css';

import { Settings } from './Settings';

export default {
  title: 'Components/Settings',
  component: Settings,
  decorators: [
    (Story) => (
      <section style={{ padding: '2rem' }}>
        <div className={menuStyles.wrapper} style={{ float: 'right' }}>
          <Story />
        </div>
      </section>
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
