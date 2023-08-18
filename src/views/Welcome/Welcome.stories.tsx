import { Meta } from '@storybook/react';

import { IdentitiesProviderMock } from '../../utilities/identities/IdentitiesProvider.mock';

import { Welcome } from './Welcome';

export default {
  title: 'Views/Welcome',
  component: Welcome,
} as Meta;

export function NoIdentities() {
  return (
    <IdentitiesProviderMock identities={{}}>
      <Welcome />
    </IdentitiesProviderMock>
  );
}

export function HasIdentities() {
  return <Welcome again />;
}
