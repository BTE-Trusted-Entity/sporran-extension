import { Meta } from '@storybook/react';
import { Hello } from './Hello';

export default {
  title: 'Components/Hello',
  component: Hello,
} as Meta;

export function Template(): JSX.Element {
  return <Hello />;
}
