import { Meta } from '@storybook/react';

import { Balance } from './Balance';

export default {
  title: 'Components/Balance',
  component: Balance,
} as Meta;

export function Template() {
  return <Balance address="4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1" />;
}

export function WithBreakdown() {
  return (
    <Balance
      address="4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1"
      breakdown
      smallDecimals
    />
  );
}
