import { Meta } from '@storybook/react';

import { moreIdentitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';

import { DidDowngradeWarningWeb3Name } from './DidDowngradeWarningWeb3Name';

export default {
  title: 'Views/DidDowngradeWarningWeb3Name',
  component: DidDowngradeWarningWeb3Name,
} as Meta;

export function Template(): JSX.Element {
  return (
    <DidDowngradeWarningWeb3Name
      identity={identities['4pzncei2Jjap98Xks5XjoBKxBeYoCzofhbki7e3sZGnqDHvK']}
    />
  );
}
