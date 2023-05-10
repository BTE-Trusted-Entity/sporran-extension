import { Meta } from '@storybook/react';
import { JSX } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';

import { credentialsMock } from '../../utilities/credentials/CredentialsProvider.mock';
import { moreIdentitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';
import { paths } from '../paths';

import { CreatePresentation } from './CreatePresentation';

export default {
  title: 'Views/CreatePresentation',
  component: CreatePresentation,
} as Meta;

const identity = identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo'];

export function Template(): JSX.Element {
  return (
    <MemoryRouter
      initialEntries={[
        `/identity/${identity.address}/credentials/${credentialsMock[12].credential.rootHash}/presentation`,
      ]}
    >
      <Route path={paths.identity.credentials.presentation}>
        <CreatePresentation identity={identity} />
      </Route>
    </MemoryRouter>
  );
}
