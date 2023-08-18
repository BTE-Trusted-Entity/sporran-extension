import { Meta } from '@storybook/react';

import * as styles from './Toggle.module.css';

export default {
  title: 'Components/Toggle',
} as Meta;

export function Template() {
  return (
    <label>
      Click me <input className={styles.toggle} type="checkbox" />
      <span />
    </label>
  );
}
