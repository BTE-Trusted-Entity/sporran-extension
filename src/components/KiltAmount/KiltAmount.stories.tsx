import { Meta } from '@storybook/react';
import { BalanceUtils } from '@kiltprotocol/core';

import { KiltAmount } from './KiltAmount';

export default {
  title: 'Components/KiltAmount',
  component: KiltAmount,
} as Meta;

export function Funds(): JSX.Element {
  return (
    <KiltAmount amount={BalanceUtils.toFemtoKilt(1.23459999)} type="funds" />
  );
}

export function Costs(): JSX.Element {
  return (
    <KiltAmount amount={BalanceUtils.toFemtoKilt(1.23459999)} type="costs" />
  );
}
