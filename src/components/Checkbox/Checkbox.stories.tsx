import { Meta } from '@storybook/react';

import * as styles from './Checkbox.module.css';

export default {
  title: 'Components/Checkbox',
} as Meta;

export function Template(): JSX.Element {
  return (
    <label>
      Click me <input className={styles.checkbox} type="checkbox" />
      <span />
    </label>
  );
}
