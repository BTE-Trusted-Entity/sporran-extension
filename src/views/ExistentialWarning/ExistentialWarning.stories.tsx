import { Meta } from '@storybook/react';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';
import { paths, generatePath } from '../paths';

import { ExistentialWarning } from './ExistentialWarning';

export default {
  title: 'Views/ExistentialWarning',
  component: ExistentialWarning,
} as Meta;

const identity = identities['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

export function Template(): JSX.Element {
  return (
    <ExistentialWarning
      path={generatePath(paths.identity.send.review, {
        address: identity.address,
      })}
    />
  );
}
