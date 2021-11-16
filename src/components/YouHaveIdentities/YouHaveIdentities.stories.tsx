import { Meta } from '@storybook/react';

import {
  identitiesMock,
  IdentitiesProviderMock,
} from '../../utilities/identities/IdentitiesProvider.mock';

import { YouHaveIdentities } from './YouHaveIdentities';

export default {
  title: 'Components/YouHaveIdentities',
  component: YouHaveIdentities,
} as Meta;

export function YouHaveOneIdentity(): JSX.Element {
  return (
    <IdentitiesProviderMock
      identities={{
        '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire':
          identitiesMock['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'],
      }}
    >
      <YouHaveIdentities />
    </IdentitiesProviderMock>
  );
}

export function YouHaveMoreIdentities(): JSX.Element {
  return <YouHaveIdentities />;
}
