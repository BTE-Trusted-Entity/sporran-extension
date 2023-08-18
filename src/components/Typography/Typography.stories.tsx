import { Meta } from '@storybook/react';

import * as styles from './Typography.module.css';

export default {
  title: 'Components/Typography',
} as Meta;

export function Template() {
  return (
    <>
      <h1 className={styles.screenHeadline} style={{ marginTop: 0 }}>
        Screen headline
      </h1>

      <h2 className={styles.importantHeadline}>Important headline</h2>

      <p className={styles.subline}>Sub-line</p>

      <h3 className={styles.identityText}>Identity text</h3>

      <p>
        <small className={styles.smallText}>Small text</small>
      </p>

      <p>
        <small className={styles.smallImportant}>Small important text</small>
      </p>

      <p>
        <kbd className={styles.inputText}>Input text</kbd>
      </p>
    </>
  );
}
