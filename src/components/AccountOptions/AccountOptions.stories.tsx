import { Meta } from '@storybook/react';
import { AccountOptions } from './AccountOptions';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Components/AccountOptions',
  component: AccountOptions,
} as Meta;

export function Template(): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return <AccountOptions onEdit={action('onEdit')} />;
}
