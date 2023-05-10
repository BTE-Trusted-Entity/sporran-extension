import { Meta } from '@storybook/react';
import { JSX } from 'react';

import * as styles from './Toggle.module.css';

export default {
  title: 'Components/Toggle',
} as Meta;

export function Template(): JSX.Element {
  return (
    <label>
      Click me <input className={styles.toggle} type="checkbox" />
      <span />
    </label>
  );
}
