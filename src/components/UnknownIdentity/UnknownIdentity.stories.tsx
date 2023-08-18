import { Meta } from '@storybook/react';

import { UnknownIdentity } from './UnknownIdentity';

export default {
  title: 'Components/UnknownIdentity',
  component: UnknownIdentity,
} as Meta;

export function Template() {
  return (
    <UnknownIdentity address="4qp7KB8jbwqS6XXL8zH8qZn3GCdnZDt6Nmq5M47ztGKhXJVh" />
  );
}
