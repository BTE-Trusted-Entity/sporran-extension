import { Meta } from '@storybook/react';
import { AccountOptions } from './AccountOptions';

export default {
  title: 'Components/AccountOptions',
  component: AccountOptions,
} as Meta;

export function Template(): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return <AccountOptions onEdit={() => {}} />;
}
