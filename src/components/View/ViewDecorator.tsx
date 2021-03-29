import styles from './View.module.css';

export function ViewDecorator(Story: () => JSX.Element): JSX.Element {
  return (
    <section className={styles.view}>
      <Story />
    </section>
  );
}
