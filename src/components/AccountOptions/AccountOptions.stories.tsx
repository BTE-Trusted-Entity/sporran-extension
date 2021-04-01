import { Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { AccountOptions } from './AccountOptions';

export default {
  title: 'Components/AccountOptions',
  component: AccountOptions,
} as Meta;

export function Template(): JSX.Element {
  return <AccountOptions onEdit={action('onEdit')} address="ADDRESS" />;
}
