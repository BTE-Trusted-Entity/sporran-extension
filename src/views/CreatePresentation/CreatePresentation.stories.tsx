import { Meta } from '@storybook/react';
import { MemoryRouter, Route } from 'react-router-dom';

import { credentialsMock } from '../../utilities/credentials/CredentialsProvider.mock';
import { moreIdentitiesMock } from '../../utilities/identities/IdentitiesProvider.mock';
import { paths } from '../paths';

import { CreatePresentation } from './CreatePresentation';

export default {
  title: 'Views/CreatePresentation',
  component: CreatePresentation,
} as Meta;

const identity =
  moreIdentitiesMock['4p1VA6zuhqKuZ8EdJA7QtjcB9mVLt3L31EKWVXfbJ6GaiQos'];

export function Template(): JSX.Element {
  return (
    <MemoryRouter
      initialEntries={[
        `/identity/${identity.address}/credentials/${credentialsMock[12].request.rootHash}/presentation`,
      ]}
    >
      <Route path={paths.identity.credentials.presentation}>
        <CreatePresentation identity={identity} />
      </Route>
    </MemoryRouter>
  );
}
