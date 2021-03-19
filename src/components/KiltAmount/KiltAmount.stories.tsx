import { Meta } from '@storybook/react';
import BN from 'bn.js';

import { KiltAmount } from './KiltAmount';

export default {
  title: 'Components/KiltAmount',
  component: KiltAmount,
} as Meta;

export function Template(): JSX.Element {
  return <KiltAmount amount={new BN(1.234e15)} />;
}
