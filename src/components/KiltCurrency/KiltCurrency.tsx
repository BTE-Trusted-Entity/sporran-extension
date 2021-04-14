import styles from './KiltCurrency.module.css';
import cx from 'classnames';

interface Props {
  small?: boolean;
}

export function KiltCurrency({ small }: Props): JSX.Element {
  return <span className={cx(styles.coin, small && styles.small)} />;
}
