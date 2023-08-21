import { Meta } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';

import * as menuStyles from '../Menu/Menu.module.css';

import { AddIdentity } from './AddIdentity';

export default {
  title: 'Components/AddIdentity',
  component: AddIdentity,
  decorators: [
    (Story) => (
      <div className={menuStyles.wrapper} style={{ float: 'right' }}>
        <Story />
      </div>
    ),
  ],
} as Meta;

export function Template() {
  return (
    <MemoryRouter
      initialEntries={[
        '/identity/4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1',
      ]}
    >
      <AddIdentity />
    </MemoryRouter>
  );
}

export function WhenCreating() {
  return (
    <MemoryRouter initialEntries={['/identity/NEW']}>
      <AddIdentity />
    </MemoryRouter>
  );
}

export function NoIdentities() {
  return (
    <MemoryRouter initialEntries={['/']}>
      <AddIdentity />
    </MemoryRouter>
  );
}
