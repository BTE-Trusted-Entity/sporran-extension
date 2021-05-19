import { Meta } from '@storybook/react';
import { browser } from 'webextension-polyfill-ts';

import { mockBackgroundScript } from '../../testing/mockBackgroundScript';

import { Stats } from './Stats';

export default {
  title: 'Components/Stats',
  component: Stats,
} as Meta;

export function Template(): JSX.Element {
  mockBackgroundScript(browser);
  return <Stats />;
}
