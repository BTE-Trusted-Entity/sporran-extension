import { Meta } from '@storybook/react';

import { legacyIdentityMock } from '../../utilities/identities/IdentitiesProvider.mock';

import { DidRepair } from './DidRepair';

export default {
  title: 'Views/DidRepair',
  component: DidRepair,
} as Meta;

export function Template(): JSX.Element {
  return <DidRepair identity={legacyIdentityMock} />;
}
