import { Meta } from '@storybook/react';
import { MemoryRouter, Route } from 'react-router-dom';

import { identitiesMock } from '../../utilities/identities/IdentitiesProvider.mock';
import { generatePath, paths } from '../paths';

import { W3NCreateSignEuro } from './W3NCreateSignEuro';

export default {
  title: 'Views/W3NCreateSignEuro',
  component: W3NCreateSignEuro,
} as Meta;

const identity =
  identitiesMock['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo'];

export function Template() {
  return (
    <MemoryRouter
      initialEntries={[
        generatePath(paths.identity.web3name.create.euro, {
          address: 'FOO',
          web3name: 'fancy-name',
        }),
      ]}
    >
      <Route path={paths.identity.web3name.create.euro}>
        <W3NCreateSignEuro identity={identity} />
      </Route>
    </MemoryRouter>
  );
}
