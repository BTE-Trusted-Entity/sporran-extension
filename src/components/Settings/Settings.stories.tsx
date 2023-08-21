import { Meta } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';

import * as menuStyles from '../Menu/Menu.module.css';

import { IdentitiesProviderMock } from '../../utilities/identities/IdentitiesProvider.mock';

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

export function NoIdentities() {
  return (
    <IdentitiesProviderMock identities={{}}>
      <Settings />
    </IdentitiesProviderMock>
  );
}

export function WithIdentities() {
  return (
    <MemoryRouter
      initialEntries={[
        '/identity/4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1',
      ]}
    >
      <Settings />
    </MemoryRouter>
  );
}
