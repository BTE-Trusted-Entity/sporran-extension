import { Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { CreatePassword } from './CreatePassword';

export default {
  title: 'Views/CreatePassword',
  component: CreatePassword,
} as Meta;

export function Template() {
  return <CreatePassword onSuccess={action('onSuccess')} />;
}
