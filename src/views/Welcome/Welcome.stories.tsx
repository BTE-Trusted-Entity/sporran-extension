import { Meta } from '@storybook/react';
import { Welcome } from './Welcome';

export default {
  title: 'Views/Welcome',
  component: Welcome,
} as Meta;

export function Template(): JSX.Element {
  return <Welcome hasAccounts={false} />;
}
