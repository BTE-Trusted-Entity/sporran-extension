import { Meta } from '@storybook/react';
import { Scroller } from './Scroller';

export default {
  title: 'Components/Scroller',
  component: Scroller,
} as Meta;

export function Template(): JSX.Element {
  return <Scroller />;
}
