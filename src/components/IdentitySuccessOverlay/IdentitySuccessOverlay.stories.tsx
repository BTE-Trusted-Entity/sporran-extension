import { action } from '@storybook/addon-actions';
import { JSX } from 'react';
import { Meta } from '@storybook/react';

import { identitiesMock } from '../../utilities/identities/IdentitiesProvider.mock';

import { IdentitySuccessOverlay } from './IdentitySuccessOverlay';

export default {
  title: 'Components/IdentitySuccessOverlay',
  component: IdentitySuccessOverlay,
} as Meta;

const identity =
  identitiesMock['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1'];

export function Template(): JSX.Element {
  return (
    <IdentitySuccessOverlay
      identity={identity}
      successType="created"
      onSuccessOverlayButtonClick={action('closeOverlay')}
    />
  );
}

export function Imported(): JSX.Element {
  return (
    <IdentitySuccessOverlay
      identity={identity}
      successType="imported"
      onSuccessOverlayButtonClick={action('closeOverlay')}
    />
  );
}

export function Reset(): JSX.Element {
  return (
    <IdentitySuccessOverlay
      identity={identity}
      successType="pwreset"
      onSuccessOverlayButtonClick={action('closeOverlay')}
    />
  );
}
