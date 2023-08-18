import { Meta } from '@storybook/react';

import { UnknownCredential } from './UnknownCredential';

export default {
  title: 'Components/UnknownCredential',
  component: UnknownCredential,
} as Meta;

export function Template() {
  return (
    <UnknownCredential rootHash="0xbe7fcc7aa0186b05fd116c100e2d673fb951163693788640ce6032ad2f700dae" />
  );
}
