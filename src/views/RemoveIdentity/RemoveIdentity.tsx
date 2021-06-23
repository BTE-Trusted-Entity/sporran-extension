import { useCallback } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { Link } from 'react-router-dom';

import { Identity } from '../../utilities/identities/types';
import { Balance } from '../../components/Balance/Balance';
import { removeIdentity } from '../../utilities/identities/identities';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { Stats } from '../../components/Stats/Stats';
import { paths } from '../paths';
import { Avatar } from '../../components/Avatar/Avatar';

import styles from './RemoveIdentity.module.css';

interface Props {
  identity: Identity;
}

export function RemoveIdentity({ identity }: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  const handleClick = useCallback(async () => {
    await removeIdentity(identity);
  }, [identity]);

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>{t('view_RemoveIdentity_heading')}</h1>
      <p className={styles.subline}>{t('view_RemoveIdentity_subline')}</p>

      <Avatar address={identity.address} />
      <p className={styles.name}>{identity.name}</p>

      <Balance address={identity.address} />

      <small className={styles.addressLabel}>
        {t('view_RemoveIdentity_address')}
      </small>
      <p className={styles.address}>{identity.address}</p>
      <p className={styles.explanation}>
        {t('view_RemoveIdentity_explanation')}
      </p>

      <p className={styles.buttonsLine}>
        <Link to={paths.home} className={styles.cancel}>
          {t('common_action_cancel')}
        </Link>
        <button type="button" onClick={handleClick} className={styles.remove}>
          {t('view_RemoveIdentity_remove')}
        </button>
      </p>

      <LinkBack />

      <Stats />
    </main>
  );
}
