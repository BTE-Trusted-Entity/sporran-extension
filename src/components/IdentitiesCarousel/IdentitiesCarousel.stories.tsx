import { Meta } from '@storybook/react';

import {
  identitiesMock,
  moreIdentitiesMock,
  IdentitiesProviderMock,
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
        identitiesMock['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire']
      }
    />
  );
}

export function NoBubbles(): JSX.Element {
  return (
    <IdentitiesProviderMock identities={moreIdentitiesMock}>
      <IdentitiesCarousel
        identity={
          moreIdentitiesMock['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire']
        }
      />
    </IdentitiesProviderMock>
  );
}
