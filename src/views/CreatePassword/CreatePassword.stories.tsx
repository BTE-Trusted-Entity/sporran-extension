import { Meta } from '@storybook/react';
import { CreatePassword } from './CreatePassword';

export default {
  title: 'Views/CreatePassword',
  component: CreatePassword,
} as Meta;

export function Template(): JSX.Element {
  return <CreatePassword onSuccess={(val) => val} />;
}
