import { Meta } from '@storybook/react';
import { browser } from 'webextension-polyfill-ts';

import { Balance } from './Balance';
import { mockBackgroundScript } from '../../testing/mockBackgroundScript';

export default {
  title: 'Components/Balance',
  component: Balance,
} as Meta;

export function Template(): JSX.Element {
  mockBackgroundScript(browser);
  return <Balance address="4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire" />;
}
