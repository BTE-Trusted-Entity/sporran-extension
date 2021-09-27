import { Meta } from '@storybook/react';

import { IdentitySlide } from './IdentitySlide';
import { IdentitySlideNew } from './IdentitySlideNew';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';

export default {
  title: 'Components/IdentitySlide',
  component: IdentitySlide,
  decorators: [(story) => <div style={{ textAlign: 'center' }}>{story()}</div>],
} as Meta;

export function Template(): JSX.Element {
  return (
    <IdentitySlide
      identity={identities['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire']}
    />
  );
}

export function LongName(): JSX.Element {
  return (
    <IdentitySlide
      identity={identities['4oyRTDhHL22Chv9T89Vv2TanfUxFzBnPeMuq4EFL3gUiHbtL']}
    />
  );
}

export function New(): JSX.Element {
  return <IdentitySlideNew />;
}

export function withFullDid(): JSX.Element {
  return (
    <IdentitySlide
      identity={identities['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr']}
    />
  );
}
