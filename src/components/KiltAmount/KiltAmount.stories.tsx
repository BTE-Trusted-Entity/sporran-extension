import { Meta } from '@storybook/react';
import { BalanceUtils } from '@kiltprotocol/chain-helpers';

import { KiltAmount } from './KiltAmount';

export default {
  title: 'Components/KiltAmount',
  component: KiltAmount,
} as Meta;

export function Funds() {
  return (
    <KiltAmount amount={BalanceUtils.toFemtoKilt(1.23459999)} type="funds" />
  );
}

export function Costs() {
  return (
    <KiltAmount amount={BalanceUtils.toFemtoKilt(1.23459999)} type="costs" />
  );
}
