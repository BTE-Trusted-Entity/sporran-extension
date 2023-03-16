import { Meta } from '@storybook/react';

import * as styles from './Input.module.css';

export default {
  title: 'Components/Input',
} as Meta;

export function Input() {
  return (
    <input
      className={styles.input}
      type="text"
      defaultValue="Enter input here"
    />
  );
}
