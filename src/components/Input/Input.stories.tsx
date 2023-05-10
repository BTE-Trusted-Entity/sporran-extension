import { Meta } from '@storybook/react';
import { Fragment, JSX } from 'react';

import * as styles from './Input.module.css';

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

export function InputRadio(): JSX.Element {
  return (
    <Fragment>
      <input className={styles.inputRadio} type="radio" name="radio" checked />
      <br />
      <input className={styles.inputRadio} type="radio" name="radio" />
    </Fragment>
  );
}
