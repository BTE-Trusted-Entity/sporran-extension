import { Meta } from '@storybook/react';
import { MemoryRouter, Route } from 'react-router-dom';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';
import { NEW } from '../../utilities/identities/identities';
import { paths } from '../paths';

import { ReceiveToken } from './ReceiveToken';

export default {
  title: 'Views/ReceiveToken',
  component: ReceiveToken,
} as Meta;

export function Template(): JSX.Element {
  return (
    <MemoryRouter
      initialEntries={[
        '/identity/4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire/receive',
      ]}
    >
      <Route path={paths.identity.receive}>
        <ReceiveToken
          identity={
            identities['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire']
          }
        />
      </Route>
    </MemoryRouter>
  );
}

export function New(): JSX.Element {
  return (
    <MemoryRouter initialEntries={['/identity/NEW/receive']}>
      <Route path={paths.identity.receive}>
        <ReceiveToken identity={NEW} />{' '}
      </Route>
    </MemoryRouter>
  );
}
