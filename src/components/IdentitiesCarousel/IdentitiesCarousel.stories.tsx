import { Meta } from '@storybook/react';
import { JSX } from 'react';

import {
  identitiesMock,
  IdentitiesProviderMock,
  moreIdentitiesMock,
} from '../../utilities/identities/IdentitiesProvider.mock';

import { IdentitiesCarousel } from './IdentitiesCarousel';

export default {
  title: 'Components/IdentitiesCarousel',
  component: IdentitiesCarousel,
  decorators: [(story) => <div style={{ textAlign: 'center' }}>{story()}</div>],
} as Meta;

export function Template(): JSX.Element {
  return (
    <IdentitiesCarousel
      identity={
        identitiesMock['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1']
      }
    />
  );
}

export function NoBubbles(): JSX.Element {
  return (
    <IdentitiesProviderMock identities={moreIdentitiesMock}>
      <IdentitiesCarousel
        identity={
          identitiesMock['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1']
        }
      />
    </IdentitiesProviderMock>
  );
}
