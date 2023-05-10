import { JSX } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { Meta } from '@storybook/react';

import { moreIdentitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';
import { generatePath, paths } from '../paths';

import { W3NManage } from './W3NManage';

export default {
  title: 'Views/W3NManage',
  component: W3NManage,
} as Meta;

export function Template(): JSX.Element {
  return (
    <MemoryRouter
      initialEntries={[
        generatePath(paths.identity.did.manage.start, { address: 'FOO' }),
      ]}
    >
      <Route path={paths.identity.did.manage.start}>
        <W3NManage
          identity={
            identities['4q11Jce9wqM4A9GPB2z8n4K8LF9w2sQgZKFddhuKXwQ2Qo4q']
          }
        />
      </Route>
    </MemoryRouter>
  );
}
