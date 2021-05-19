import { Meta } from '@storybook/react';
import { browser } from 'webextension-polyfill-ts';

import { Stats } from './Stats';
import { mockBackgroundScript } from '../../testing/mockBackgroundScript';

export default {
  title: 'Components/Stats',
  component: Stats,
} as Meta;

export function Template(): JSX.Element {
  mockBackgroundScript(browser);
  return <Stats />;
}
