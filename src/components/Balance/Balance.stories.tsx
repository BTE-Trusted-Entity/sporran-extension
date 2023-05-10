import { Meta } from '@storybook/react';
import { JSX } from 'react';

import { Balance } from './Balance';

export default {
  title: 'Components/Balance',
  component: Balance,
} as Meta;

export function Template(): JSX.Element {
  return <Balance address="4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1" />;
}

export function WithBreakdown(): JSX.Element {
  return (
    <Balance
      address="4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1"
      breakdown
      smallDecimals
    />
  );
}
