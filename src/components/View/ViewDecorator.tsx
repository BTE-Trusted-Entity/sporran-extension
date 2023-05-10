import { JSX } from 'react';

import * as styles from './View.module.css';

export function ViewDecorator(Story: () => JSX.Element) {
  return (
    <section className={styles.view}>
      <Story />
    </section>
  );
}
