import { Meta } from '@storybook/react';
import { AccountOptions } from './AccountOptions';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Components/AccountOptions',
  component: AccountOptions,
} as Meta;

export function Template(): JSX.Element {
  return <AccountOptions onEdit={action('onEdit')} />;
}
