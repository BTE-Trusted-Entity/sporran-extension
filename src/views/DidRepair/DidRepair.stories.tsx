import { Meta } from '@storybook/react';
import { JSX } from 'react';

import { legacyIdentity } from '../../utilities/identities/IdentitiesProvider.mock';

import { DidRepair } from './DidRepair';

export default {
  title: 'Views/DidRepair',
  component: DidRepair,
} as Meta;

export function Template(): JSX.Element {
  return <DidRepair identity={legacyIdentity} />;
}
