import { Meta } from '@storybook/react';
import { JSX } from 'react';

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
        '4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1':
          identitiesMock['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1'],
      }}
    >
      <YouHaveIdentities />
    </IdentitiesProviderMock>
  );
}

export function YouHaveMoreIdentities(): JSX.Element {
  return <YouHaveIdentities />;
}
