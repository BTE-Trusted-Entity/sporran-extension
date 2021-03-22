import { Meta } from '@storybook/react';
import { ReceiveToken } from './ReceiveToken';

export default {
  title: 'Views/ReceiveToken',
  component: ReceiveToken,
} as Meta;

export function Template(): JSX.Element {
  return <ReceiveToken />;
}
