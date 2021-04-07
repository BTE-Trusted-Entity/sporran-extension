import { Meta } from '@storybook/react';

import styles from './Input.module.css';

export default {
  title: 'Components/Input',
} as Meta;

export function Input(): JSX.Element {
  return (
    <input
      className={styles.input}
      type="text"
      defaultValue="Paste here the Receiver Address"
    />
  );
}

export function InputKiltAmount(): JSX.Element {
  return (
    <input
      className={styles.inputKiltAmount}
      type="text"
      inputMode="numeric"
      defaultValue="1.234"
    />
  );
}
