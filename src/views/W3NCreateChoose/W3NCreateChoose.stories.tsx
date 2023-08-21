import { Meta } from '@storybook/react';
import { MemoryRouter, Route } from 'react-router-dom';

import { moreIdentitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';
import { generatePath, paths } from '../paths';

import { W3NCreateChoose } from './W3NCreateChoose';

export default {
  title: 'Views/W3NCreateChoose',
  component: W3NCreateChoose,
} as Meta;

export function Template() {
  return (
    <MemoryRouter
      initialEntries={[
        generatePath(paths.identity.web3name.create.choose, {
          address: '4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo',
          web3name: 'mr_pink',
        }),
      ]}
    >
      <Route path={paths.identity.web3name.create.choose}>
        <W3NCreateChoose
          identity={
            identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo']
          }
        />
      </Route>
    </MemoryRouter>
  );
}
