import { Meta } from '@storybook/react';

import * as menuStyles from '../Menu/Menu.module.css';

import { AddIdentity } from './AddIdentity';

export default {
  title: 'Components/AddIdentity',
  component: AddIdentity,
  decorators: [
    (Story) => (
      <div className={menuStyles.wrapper} style={{ float: 'right' }}>
        <Story />
      </div>
    ),
  ],
} as Meta;

export function Template(): JSX.Element {
  return <AddIdentity />;
}
