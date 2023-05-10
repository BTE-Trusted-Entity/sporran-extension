import { JSX } from 'react';

import * as styles from './IdentityLine.module.css';

import { Identity } from '../../utilities/identities/types';
import { Avatar } from '../Avatar/Avatar';
import { KiltAmount } from '../KiltAmount/KiltAmount';
import { useAddressBalance } from '../Balance/Balance';

interface Props {
  identity: Identity;
  className?: string;
}

export function IdentityLine({
  identity,
  className = styles.component,
}: Props): JSX.Element {
  const balance = useAddressBalance(identity.address);

  return (
    <section className={className}>
      <section className={styles.identity}>
        <Avatar identity={identity} className={styles.avatar} />
        <p className={styles.name}>{identity.name}</p>
      </section>
      {balance && <KiltAmount amount={balance.total} type="funds" />}
    </section>
  );
}
