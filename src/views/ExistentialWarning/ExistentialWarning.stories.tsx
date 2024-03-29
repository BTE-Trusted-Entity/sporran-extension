import { Meta } from '@storybook/react';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';
import { generatePath, paths } from '../paths';

import { ExistentialWarning } from './ExistentialWarning';

export default {
  title: 'Views/ExistentialWarning',
  component: ExistentialWarning,
} as Meta;

const identity = identities['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1'];

export function Template() {
  return (
    <ExistentialWarning
      nextPath={generatePath(paths.identity.send.review, {
        address: identity.address,
      })}
    />
  );
}
