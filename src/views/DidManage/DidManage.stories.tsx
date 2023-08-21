import { MemoryRouter, Route } from 'react-router-dom';
import { Meta } from '@storybook/react';

import { moreIdentitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';
import { generatePath, paths } from '../paths';

import { DidManage } from './DidManage';

export default {
  title: 'Views/DidManage',
  component: DidManage,
} as Meta;

export function WithoutWeb3Name() {
  return (
    <MemoryRouter
      initialEntries={[
        generatePath(paths.identity.did.manage.start, { address: 'FOO' }),
      ]}
    >
      <Route path={paths.identity.did.manage.start}>
        <DidManage
          identity={
            identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo']
          }
        />
      </Route>
    </MemoryRouter>
  );
}

export function WithWeb3Name() {
  return (
    <MemoryRouter
      initialEntries={[
        generatePath(paths.identity.did.manage.start, { address: 'FOO' }),
      ]}
    >
      <Route path={paths.identity.did.manage.start}>
        <DidManage
          identity={
            identities['4q11Jce9wqM4A9GPB2z8n4K8LF9w2sQgZKFddhuKXwQ2Qo4q']
          }
        />
      </Route>
    </MemoryRouter>
  );
}
