import { Meta } from '@storybook/react';

import { KiltCurrency } from './KiltCurrency';

export default {
  title: 'Components/KiltCurrency',
  component: KiltCurrency,
} as Meta;

export function Template() {
  return <KiltCurrency />;
}
