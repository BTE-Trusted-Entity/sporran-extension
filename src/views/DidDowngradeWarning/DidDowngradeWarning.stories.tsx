import { Meta } from '@storybook/react';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';

import { DidDowngradeWarning } from './DidDowngradeWarning';

export default {
  title: 'Views/DidDowngradeWarning',
  component: DidDowngradeWarning,
} as Meta;

export function Template(): JSX.Element {
  return (
    <DidDowngradeWarning
      identity={identities['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr']}
    />
  );
}
