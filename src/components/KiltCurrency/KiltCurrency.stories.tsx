import { Meta } from '@storybook/react';
import { JSX } from 'react';

import { KiltCurrency } from './KiltCurrency';

export default {
  title: 'Components/KiltCurrency',
  component: KiltCurrency,
} as Meta;

export function Template(): JSX.Element {
  return <KiltCurrency />;
}
