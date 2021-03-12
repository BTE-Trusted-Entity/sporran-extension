import { Meta } from '@storybook/react';
import { Welcome } from './Welcome';

export default {
  title: 'Views/Welcome',
  component: Welcome,
  decorators: [
    (Story) => (
      <div
        style={{ height: '600px', width: '500px', border: '2px solid black' }}
      >
        <Story />
      </div>
    ),
  ],
} as Meta;

export function Template(): JSX.Element {
  return <Welcome />;
}
