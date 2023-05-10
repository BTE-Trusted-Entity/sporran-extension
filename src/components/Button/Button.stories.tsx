import { Meta } from '@storybook/react';
import { JSX } from 'react';

import * as storiesStyles from './Button.stories.module.css';
import * as styles from './Button.module.css';

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

export function ButtonTertiary(): JSX.Element {
  return (
    <button className={styles.buttonTertiary} type="button">
      Update Balance
    </button>
  );
}

export function ButtonTertiaryDisabled(): JSX.Element {
  return (
    <button className={styles.buttonTertiary} type="button" disabled>
      Update Balance
    </button>
  );
}

export function ButtonWide(): JSX.Element {
  return (
    <button className={storiesStyles.wide} type="button">
      Update Balance
    </button>
  );
}

export function ButtonTriangleNew(): JSX.Element {
  return (
    <button className={storiesStyles.triangleNew} type="button">
      Manage On-Chain DID
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
