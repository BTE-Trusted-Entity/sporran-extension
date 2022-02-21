import { Meta } from '@storybook/react';
import { MemoryRouter, Route } from 'react-router-dom';

import { credentialsMock } from '../../utilities/credentials/CredentialsProvider.mock';
import { identitiesMock } from '../../utilities/identities/IdentitiesProvider.mock';
import { paths } from '../paths';

import { CreatePresentation } from './CreatePresentation';

export default {
  title: 'Views/CreatePresentation',
  component: CreatePresentation,
} as Meta;

const identity =
  identitiesMock['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

export function Template(): JSX.Element {
  return (
    <MemoryRouter
      initialEntries={[
        `/identity/${identity.address}/credentials/${credentialsMock[0].request.rootHash}/presentation`,
      ]}
    >
      <Route path={paths.identity.credentials.presentation}>
        <CreatePresentation identity={identity} />
      </Route>
    </MemoryRouter>
  );
}
