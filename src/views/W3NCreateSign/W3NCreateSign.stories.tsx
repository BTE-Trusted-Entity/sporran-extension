import { Meta } from '@storybook/react';
import { JSX } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';

import { identitiesMock } from '../../utilities/identities/IdentitiesProvider.mock';

import { generatePath, paths } from '../paths';

import { W3NCreateSign } from './W3NCreateSign';

export default {
  title: 'Views/W3NCreateSign',
  component: W3NCreateSign,
} as Meta;

const identity =
  identitiesMock['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo'];

export function Template(): JSX.Element {
  return (
    <MemoryRouter
      initialEntries={[
        generatePath(paths.identity.web3name.create.kilt, {
          address: 'FOO',
          web3name: 'fancy-name',
        }),
      ]}
    >
      <Route path={paths.identity.web3name.create.kilt}>
        <W3NCreateSign identity={identity} />
      </Route>
    </MemoryRouter>
  );
}
