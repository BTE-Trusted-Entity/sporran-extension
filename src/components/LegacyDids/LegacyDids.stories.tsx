import { Meta } from '@storybook/react';

import { action } from '@storybook/addon-actions';

import { moreIdentitiesMock } from '../../utilities/identities/IdentitiesProvider.mock';

import { LegacyDids } from './LegacyDids';

export default {
  title: 'Components/LegacyDids',
  component: LegacyDids,
} as Meta;

export function Template(): JSX.Element {
  return (
    <LegacyDids identities={moreIdentitiesMock} onClose={action('onClose')} />
  );
}
