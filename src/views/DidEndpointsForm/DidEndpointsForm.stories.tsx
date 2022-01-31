import { MemoryRouter, Route } from 'react-router-dom';
import { Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { identitiesMock } from '../../utilities/identities/IdentitiesProvider.mock';
import { generatePath, paths } from '../paths';

import { DidEndpointsForm } from './DidEndpointsForm';

export default {
  title: 'Views/DidEndpointsForm',
  component: DidEndpointsForm,
} as Meta;

const identity =
  identitiesMock['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr'];

export function Template(): JSX.Element {
  return (
    <MemoryRouter
      initialEntries={[
        generatePath(paths.identity.did.manage.endpoints.start, {
          address: 'FOO',
        }),
      ]}
    >
      <Route path={paths.identity.did.manage.endpoints.edit}>
        <DidEndpointsForm
          identity={identity}
          onAdd={action('add')}
          onRemove={action('remove')}
        />
      </Route>
    </MemoryRouter>
  );
}
