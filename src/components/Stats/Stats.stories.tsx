import { Meta } from '@storybook/react';
import { JSX } from 'react';

import { Stats } from './Stats';

export default {
  title: 'Components/Stats',
  component: Stats,
} as Meta;

export function Template(): JSX.Element {
  return <Stats />;
}
