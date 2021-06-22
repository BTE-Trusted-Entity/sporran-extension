import { Meta } from '@storybook/react';

import { Balance } from './Balance';

export default {
  title: 'Components/Balance',
  component: Balance,
} as Meta;

export function Template(): JSX.Element {
  return <Balance address="4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire" />;
}

export function WithBreakdown(): JSX.Element {
  return (
    <Balance
      address="4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire"
      breakdown
    />
  );
}
