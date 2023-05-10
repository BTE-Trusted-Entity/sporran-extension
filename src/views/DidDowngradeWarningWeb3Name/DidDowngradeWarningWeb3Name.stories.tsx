import { Meta } from '@storybook/react';
import { JSX } from 'react';

import { moreIdentitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';

import { DidDowngradeWarningWeb3Name } from './DidDowngradeWarningWeb3Name';

export default {
  title: 'Views/DidDowngradeWarningWeb3Name',
  component: DidDowngradeWarningWeb3Name,
} as Meta;

export function Template(): JSX.Element {
  return (
    <DidDowngradeWarningWeb3Name
      identity={identities['4q11Jce9wqM4A9GPB2z8n4K8LF9w2sQgZKFddhuKXwQ2Qo4q']}
    />
  );
}
