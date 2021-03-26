import { Meta } from '@storybook/react';

import styles from './Input.module.css';

export default {
  title: 'Components/Input',
} as Meta;

const background = {
  padding: '2rem',
};

export function Input(): JSX.Element {
  return (
    <section style={background}>
      <input
        className={styles.input}
        type="text"
        defaultValue="Paste here the Receiver Address"
      />
    </section>
  );
}

export function InputKiltAmount(): JSX.Element {
  return (
    <section style={background}>
      <input
        className={styles.inputKiltAmount}
        type="text"
        inputMode="numeric"
        defaultValue="1.234"
      />
    </section>
  );
}
