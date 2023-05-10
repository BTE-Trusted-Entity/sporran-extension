import { Meta } from '@storybook/react';
import { JSX } from 'react';
import { action } from '@storybook/addon-actions';

import { CreatePassword } from './CreatePassword';

export default {
  title: 'Views/CreatePassword',
  component: CreatePassword,
} as Meta;

export function Template(): JSX.Element {
  return <CreatePassword onSuccess={action('onSuccess')} />;
}
