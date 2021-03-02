import { storiesOf } from '@storybook/react';
import { Hello } from './Hello';

storiesOf('Hello', module).add('renders', () => {
  return <Hello />;
});
