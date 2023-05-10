import { Meta } from '@storybook/react';
import { JSX } from 'react';

import { CopyValue } from './CopyValue';

export default {
  title: 'Components/CopyValue',
  component: CopyValue,
} as Meta;

export function Template(): JSX.Element {
  return <CopyValue value="FOO" label="BAR" />;
}
