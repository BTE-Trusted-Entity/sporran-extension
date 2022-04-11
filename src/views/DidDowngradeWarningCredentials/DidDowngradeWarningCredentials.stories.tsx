import { Meta } from '@storybook/react';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';

import { DidDowngradeWarningCredentials } from './DidDowngradeWarningCredentials';

export default {
  title: 'Views/DidDowngradeWarningCredentials',
  component: DidDowngradeWarningCredentials,
} as Meta;

export function Template(): JSX.Element {
  return (
    <DidDowngradeWarningCredentials
      identity={identities['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr']}
    />
  );
}
