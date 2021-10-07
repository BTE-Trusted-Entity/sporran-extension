import { Meta } from '@storybook/react';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';

import { DidDowngrade } from './DidDowngrade';

export default {
  title: 'Views/DidDowngrade',
  component: DidDowngrade,
} as Meta;

export function Template(): JSX.Element {
  return (
    <DidDowngrade
      identity={identities['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr']}
    />
  );
}
