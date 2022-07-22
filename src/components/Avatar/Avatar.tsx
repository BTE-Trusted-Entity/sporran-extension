import * as styles from './Avatar.module.css';

import { Identity } from '../../utilities/identities/types';

import { Identicon } from './Identicon';

interface Props {
  identity: Identity;
  className?: string;
}

export function Avatar({
  identity,
  className = styles.avatar,
}: Props): JSX.Element {
  return (
    <div className={className}>
      <Identicon
        className={styles.identicon}
        address={identity.address}
        size={64}
      />
    </div>
  );
}
