import { Meta } from '@storybook/react';

import * as storiesStyles from './Button.stories.module.css';
import * as styles from './Button.module.css';

export default {
  title: 'Components/Button',
} as Meta;

export function ButtonPrimary() {
  return (
    <button className={styles.buttonPrimary} type="button">
      Review transaction
    </button>
  );
}

export function ButtonPrimaryDisabled() {
  return (
    <button className={styles.buttonPrimary} type="button" disabled>
      Review transaction
    </button>
  );
}

export function ButtonSecondary() {
  return (
    <button className={styles.buttonSecondary} type="button">
      Cancel
    </button>
  );
}

export function ButtonSecondaryDisabled() {
  return (
    <button className={styles.buttonSecondary} type="button" disabled>
      Cancel
    </button>
  );
}

export function ButtonTertiary() {
  return (
    <button className={styles.buttonTertiary} type="button">
      Update Balance
    </button>
  );
}

export function ButtonTertiaryDisabled() {
  return (
    <button className={styles.buttonTertiary} type="button" disabled>
      Update Balance
    </button>
  );
}

export function ButtonWide() {
  return (
    <button className={storiesStyles.wide} type="button">
      Update Balance
    </button>
  );
}

export function ButtonTriangleNew() {
  return (
    <button className={storiesStyles.triangleNew} type="button">
      Manage On-Chain DID
    </button>
  );
}

export function ButtonIcon() {
  return <button className={storiesStyles.icon} type="button" />;
}

export function ButtonCheckmark() {
  return <button className={styles.buttonCheckmark} type="button" />;
}

export function ButtonCross() {
  return <button className={styles.buttonCross} type="button" />;
}
