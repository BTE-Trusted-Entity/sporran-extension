import { Meta } from '@storybook/react';

import { AccountSlide } from './AccountSlide';
import { AccountSlideNew } from './AccountSlideNew';

export default {
  title: 'Components/AccountSlide',
  component: AccountSlide,
} as Meta;

export function Template(): JSX.Element {
  return (
    <AccountSlide
      account={{
        name: 'My Sporran Account',
        address: '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire',
        index: 1,
      }}
    />
  );
}

export function New(): JSX.Element {
  return <AccountSlideNew />;
}
