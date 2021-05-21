import { Meta } from '@storybook/react';
import BN from 'bn.js';

import { KiltAmount } from './KiltAmount';

export default {
  title: 'Components/KiltAmount',
  component: KiltAmount,
} as Meta;

export function Funds(): JSX.Element {
  return <KiltAmount amount={new BN(1.23459999e15)} type="funds" />;
}

export function Costs(): JSX.Element {
  return <KiltAmount amount={new BN(1.23459999e15)} type="costs" />;
}
