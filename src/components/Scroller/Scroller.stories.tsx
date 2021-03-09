import { Scroller } from './Scroller';
import { Meta } from '@storybook/react';

export default {
  title: 'Components/Scroller',
  component: Scroller,
} as Meta;

export function Template(): JSX.Element {
  return <Scroller />;
}
