import * as styles from './IdentityLine.module.css';

import { Identity } from '../../utilities/identities/types';
import { Avatar } from '../Avatar/Avatar';

interface Props {
  identity: Identity;
  className?: string;
}

export function IdentityLine({
  identity,
  className = styles.component,
}: Props) {
  return (
    <section className={className}>
      <section className={styles.identity}>
        <Avatar identity={identity} className={styles.avatar} />
        <p className={styles.name}>{identity.name}</p>
      </section>
    </section>
  );
}
