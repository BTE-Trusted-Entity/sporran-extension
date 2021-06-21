import { Identicon } from './Identicon';

import styles from './Avatar.module.css';

interface Props {
  address: string;
  className?: string;
}

export function Avatar({
  address,
  className = styles.avatar,
}: Props): JSX.Element {
  return (
    <div className={className}>
      <Identicon className={styles.identicon} address={address} size={64} />
    </div>
  );
}
