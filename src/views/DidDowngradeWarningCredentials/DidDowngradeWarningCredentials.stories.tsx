import { Meta } from '@storybook/react';
import { JSX } from 'react';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';

import { DidDowngradeWarningCredentials } from './DidDowngradeWarningCredentials';

export default {
  title: 'Views/DidDowngradeWarningCredentials',
  component: DidDowngradeWarningCredentials,
} as Meta;

export function Template(): JSX.Element {
  return (
    <DidDowngradeWarningCredentials
      identity={identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo']}
    />
  );
}
