import Identicon from '@polkadot/react-identicon';

import styles from './Avatar.module.css';

interface Props {
  tartan: string;
  address?: string;
}

export function Avatar({ tartan, address }: Props): JSX.Element {
  return (
    <div className={`${styles[tartan]} ${styles.tartan}`}>
      {address ? (
        <Identicon
          className={styles.identicon}
          value={address}
          size={65}
          theme="polkadot"
        />
      ) : (
        // TODO: https://kiltprotocol.atlassian.net/browse/SK-93
        <div />
      )}
    </div>
  );
}
