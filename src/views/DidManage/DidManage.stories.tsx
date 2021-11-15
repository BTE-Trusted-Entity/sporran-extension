import { Meta } from '@storybook/react';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';

import { DidManage } from './DidManage';

export default {
  title: 'Views/DidManage',
  component: DidManage,
} as Meta;

export function Template(): JSX.Element {
  return (
    <DidManage
      identity={identities['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr']}
    />
  );
}
