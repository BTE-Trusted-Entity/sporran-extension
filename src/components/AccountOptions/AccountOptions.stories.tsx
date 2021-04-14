import { Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import menuStyles from '../Menu/Menu.module.css';

import { AccountOptions } from './AccountOptions';

export default {
  title: 'Components/AccountOptions',
  component: AccountOptions,
  decorators: [
    (Story) => (
      <div className={menuStyles.wrapper} style={{ float: 'right' }}>
        <Story />
      </div>
    ),
  ],
} as Meta;

export function Template(): JSX.Element {
  return <AccountOptions onEdit={action('onEdit')} address="ADDRESS" />;
}
