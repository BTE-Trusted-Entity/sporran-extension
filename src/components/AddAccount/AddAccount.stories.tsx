import { Meta } from '@storybook/react';

import menuStyles from '../Menu/Menu.module.css';

import { AddAccount } from './AddAccount';

export default {
  title: 'Components/AddAccount',
  component: AddAccount,
  decorators: [
    (Story) => (
      <section style={{ padding: '2rem' }}>
        <div className={menuStyles.wrapper} style={{ float: 'right' }}>
          <Story />
        </div>
      </section>
    ),
  ],
} as Meta;

export function Template(): JSX.Element {
  return <AddAccount />;
}
