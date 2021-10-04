import { Meta } from '@storybook/react';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';

import { DidDowngradeExplainer } from './DidDowngradeExplainer';

export default {
  title: 'Views/DidDowngradeExplainer',
  component: DidDowngradeExplainer,
} as Meta;

export function Template(): JSX.Element {
  return (
    <DidDowngradeExplainer
      identity={identities['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr']}
    />
  );
}
