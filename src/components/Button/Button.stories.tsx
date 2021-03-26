import { Meta } from '@storybook/react';

import styles from './Button.module.css';

export default {
  title: 'Components/Button',
} as Meta;

const background = {
  padding: '2rem',
};

export function ButtonPrimary(): JSX.Element {
  return (
    <section style={background}>
      <button className={styles.buttonPrimary} type="button">
        Review transaction
      </button>
    </section>
  );
}

export function ButtonPrimaryDisabled(): JSX.Element {
  return (
    <section style={background}>
      <button className={styles.buttonPrimary} type="button" disabled>
        Review transaction
      </button>
    </section>
  );
}

export function ButtonSecondary(): JSX.Element {
  return (
    <section style={background}>
      <button className={styles.buttonSecondary} type="button">
        Cancel
      </button>
    </section>
  );
}

export function ButtonSecondaryDisabled(): JSX.Element {
  return (
    <section style={background}>
      <button className={styles.buttonSecondary} type="button" disabled>
        Cancel
      </button>
    </section>
  );
}
