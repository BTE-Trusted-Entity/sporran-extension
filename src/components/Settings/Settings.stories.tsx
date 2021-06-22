import { Meta } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';

import { IdentitiesProviderMock } from '../../utilities/identities/IdentitiesProvider.mock';
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

export function NoIdentities(): JSX.Element {
  return (
    <IdentitiesProviderMock identities={{}}>
      <Settings />
    </IdentitiesProviderMock>
  );
}

export function WithIdentities(): JSX.Element {
  return (
    <MemoryRouter
      initialEntries={[
        '/identity/4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire',
      ]}
    >
      <Settings />
    </MemoryRouter>
  );
}
