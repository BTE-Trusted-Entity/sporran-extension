import { Meta } from '@storybook/react';
import { JSX } from 'react';

import { Warning } from './Warning';

export default {
  title: 'Views/Warning',
  component: Warning,
} as Meta;

export function Template(): JSX.Element {
  return <Warning />;
}
