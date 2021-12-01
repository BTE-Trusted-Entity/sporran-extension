import { MemoryRouter, Route, Routes, Switch } from 'react-router-dom';
import { Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { NEW } from '../../utilities/identities/identities';
import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';
import { paths } from '../paths';

import { SendToken } from './SendToken';

export default {
  title: 'Views/SendToken',
  component: SendToken,
} as Meta;

export function Template(): JSX.Element {
  return (
    <MemoryRouter
      initialEntries={[
        '/identity/4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire/send',
      ]}
    >
      <Routes>
        <Route path={paths.identity.send.start}>
          <SendToken
            identity={
              identities['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire']
            }
            onSuccess={action('onSuccess')}
          />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

export function New(): JSX.Element {
  return (
    <MemoryRouter initialEntries={['/identity/NEW/send']}>
      <Routes>
        <Route path={paths.identity.send.start}>
          <SendToken identity={NEW} onSuccess={action('onSuccess')} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}
