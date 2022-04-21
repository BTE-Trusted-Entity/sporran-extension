import { Meta } from '@storybook/react';

import { MemoryRouter, Route } from 'react-router-dom';

import { identitiesMock } from '../../utilities/identities/IdentitiesProvider.mock';

import { generatePath, paths } from '../paths';

import { W3NCreatePromo } from './W3NCreatePromo';

export default {
  title: 'Views/W3NCreatePromo',
  component: W3NCreatePromo,
} as Meta;

const identity =
  identitiesMock['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo'];

export function Template(): JSX.Element {
  return (
    <MemoryRouter
      initialEntries={[
        generatePath(paths.identity.did.web3name.create.promo.sign, {
          address: 'FOO',
          web3name: 'fancy-name',
        }),
      ]}
    >
      <Route path={paths.identity.did.web3name.create.promo.sign}>
        <W3NCreatePromo identity={identity} />
      </Route>
    </MemoryRouter>
  );
}
