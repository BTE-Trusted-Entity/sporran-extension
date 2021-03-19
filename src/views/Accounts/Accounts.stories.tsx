import { Meta } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';

import { Accounts } from './Accounts';

export default {
  title: 'Views/Accounts',
  component: Accounts,
} as Meta;

export function Template(): JSX.Element {
  return (
    <MemoryRouter
      initialEntries={[
        '/account/4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire',
      ]}
    >
      <Accounts
        accounts={{
          '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire': {
            name: 'My Sporran Account',
            address: '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire',
          },
        }}
      />
    </MemoryRouter>
  );
}
