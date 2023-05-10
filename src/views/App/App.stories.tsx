import { Meta } from '@storybook/react';
import { JSX } from 'react';

import { App } from './App';

export default {
  title: 'Views/App',
  component: App,
  parameters: { ViewDecorator: { disable: true } },
} as Meta;

export function Template(): JSX.Element {
  return <App />;
}
