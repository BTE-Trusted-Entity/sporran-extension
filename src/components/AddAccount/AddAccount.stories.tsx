import { Meta } from '@storybook/react';

import { AddAccount } from './AddAccount';

export default {
  title: 'Components/AddAccount',
  component: AddAccount,
} as Meta;

function mockUseAccounts() {
  return {
    data: {
      '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire': {
        name: 'My Sporran Account',
        address: '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire',
        index: 1,
      },
    },
    revalidate: async () => true,
    mutate: () => undefined,
    isValidating: false,
  };
}

export function Template(): JSX.Element {
  return <AddAccount useAccounts={mockUseAccounts} />;
}
