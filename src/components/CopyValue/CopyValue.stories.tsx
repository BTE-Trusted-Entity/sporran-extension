import { Meta } from '@storybook/react';

import { CopyValue } from './CopyValue';

export default {
  title: 'Components/CopyValue',
  component: CopyValue,
} as Meta;

export function Template() {
  return <CopyValue value="FOO" label="BAR" />;
}
