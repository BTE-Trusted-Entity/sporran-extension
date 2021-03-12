import { Meta } from '@storybook/react';
import { App } from './App';

export default {
  title: 'Views/App',
  component: App,
} as Meta;

export function Template(): JSX.Element {
  return <App />;
}
