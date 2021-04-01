import { Meta } from '@storybook/react';

import { AddAccount } from './AddAccount';

export default {
  title: 'Components/AddAccount',
  component: AddAccount,
} as Meta;

export function Template(): JSX.Element {
  return <AddAccount />;
}
