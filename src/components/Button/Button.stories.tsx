import { Meta } from '@storybook/react';

import * as storiesStyles from './Button.stories.module.css';
import * as styles from './Button.module.css';

export default {
  title: 'Components/Button',
} as Meta;

export function ButtonPrimary(): JSX.Element {
  return (
    <button className={styles.buttonPrimary} type="button">
      Button Primary
    </button>
  );
}

export function ButtonPrimaryDisabled(): JSX.Element {
  return (
    <button className={styles.buttonPrimary} type="button" disabled>
      Primary Disabled
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

export function ButtonWide(): JSX.Element {
  return (
    <button className={storiesStyles.wide} type="button">
      Button Wide
    </button>
  );
}

export function ButtonIcon(): JSX.Element {
  return <button className={storiesStyles.icon} type="button" />;
}

export function ButtonCheckmark(): JSX.Element {
  return <button className={styles.buttonCheckmark} type="button" />;
}

export function ButtonCross(): JSX.Element {
  return <button className={styles.buttonCross} type="button" />;
}
