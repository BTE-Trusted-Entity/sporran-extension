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

export function Template(): JSX.Element {
  return (
    <MemoryRouter
      initialEntries={[
        '/identity/4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire',
      ]}
    >
      <AddIdentity />
    </MemoryRouter>
  );
}

export function WhenCreating(): JSX.Element {
  return (
    <MemoryRouter initialEntries={['/identity/NEW']}>
      <AddIdentity />
    </MemoryRouter>
  );
}

export function NoIdentities(): JSX.Element {
  return (
    <MemoryRouter initialEntries={['/']}>
      <AddIdentity />
    </MemoryRouter>
  );
}
