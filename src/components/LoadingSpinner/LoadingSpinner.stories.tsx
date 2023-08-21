import { Meta } from '@storybook/react';

import * as styles from './LoadingSpinner.module.css';

export default {
  title: 'Components/Loading Spinner',
} as Meta;

export function Template() {
  return <div className={styles.spinner}></div>;
}
