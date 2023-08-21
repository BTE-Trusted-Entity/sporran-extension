import { Meta } from '@storybook/react';

import * as styles from './Card.module.css';

export default {
  title: 'Components/Card',
} as Meta;

export function Collapsed() {
  return (
    <ul>
      <li className={styles.card} aria-expanded="false">
        <button type="button" className={styles.expand}>
          <section className={styles.collapsedCard}>
            <h4 className={styles.collapsedName}>Name</h4>
            <p className={styles.collapsedValue}>Value</p>
          </section>
        </button>
      </li>
    </ul>
  );
}

export function Expanded() {
  return (
    <ul>
      <li className={styles.card} aria-expanded="true">
        <section className={styles.expanded}>
          <button
            type="button"
            aria-label="Collapse"
            className={styles.collapse}
          />
        </section>
      </li>
    </ul>
  );
}
