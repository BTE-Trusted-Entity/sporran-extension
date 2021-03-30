import { Meta } from '@storybook/react';

import { Settings } from './Settings';

export default {
  title: 'Components/Settings',
  component: Settings,
} as Meta;

export function NoAccounts(): JSX.Element {
  return <Settings />;
}

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

export function WithAccounts(): JSX.Element {
  return <Settings useAccounts={mockUseAccounts} />;
}
