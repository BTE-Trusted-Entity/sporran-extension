import { Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import menuStyles from '../Menu/Menu.module.css';

import { IdentityOptions } from './IdentityOptions';

export default {
  title: 'Components/IdentityOptions',
  component: IdentityOptions,
  decorators: [
    (Story) => (
      <div className={menuStyles.wrapper} style={{ float: 'right' }}>
        <Story />
      </div>
    ),
  ],
} as Meta;

export function Template(): JSX.Element {
  return <IdentityOptions onEdit={action('onEdit')} address="ADDRESS" />;
}
