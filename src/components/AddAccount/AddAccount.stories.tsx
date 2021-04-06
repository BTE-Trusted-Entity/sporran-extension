import { Meta } from '@storybook/react';

import menuStyles from '../Menu/Menu.module.css';

import { AddAccount } from './AddAccount';

export default {
  title: 'Components/AddAccount',
  component: AddAccount,
  decorators: [
    (Story) => (
      <div className={menuStyles.wrapper} style={{ float: 'right' }}>
        <Story />
      </div>
    ),
  ],
} as Meta;

export function Template(): JSX.Element {
  return <AddAccount />;
}
