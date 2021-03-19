import { Meta } from '@storybook/react';

import { Account } from './Account';

export default {
  title: 'Views/Account',
  component: Account,
} as Meta;

export function Template(): JSX.Element {
  return (
    <Account
      account={{
        name: 'My Sporran Account',
        address: '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire',
      }}
    />
  );
}
