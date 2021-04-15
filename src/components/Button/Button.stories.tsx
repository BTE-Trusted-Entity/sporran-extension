import { Meta } from '@storybook/react';

import storiesStyles from './Button.stories.module.css';
import styles from './Button.module.css';

export default {
  title: 'Components/Button',
} as Meta;

export function ButtonPrimary(): JSX.Element {
  return (
    <button className={styles.buttonPrimary} type="button">
      Review transaction
    </button>
  );
}

export function ButtonPrimaryDisabled(): JSX.Element {
  return (
    <button className={styles.buttonPrimary} type="button" disabled>
      Review transaction
    </button>
  );
}

export function ButtonSecondary(): JSX.Element {
  return (
    <button className={styles.buttonSecondary} type="button">
      Cancel
    </button>
  );
}

export function ButtonSecondaryDisabled(): JSX.Element {
  return (
    <button className={styles.buttonSecondary} type="button" disabled>
      Cancel
    </button>
  );
}

export function ButtonIcon(): JSX.Element {
  return <button className={storiesStyles.icon} type="button" />;
}
