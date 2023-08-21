import { useCallback } from 'react';
import browser from 'webextension-polyfill';
import { Link, useHistory } from 'react-router-dom';
import { map, without } from 'lodash-es';

import * as styles from './RemoveIdentity.module.css';

import { Identity } from '../../utilities/identities/types';
import { Balance } from '../../components/Balance/Balance';
import {
  removeIdentity,
  useIdentities,
} from '../../utilities/identities/identities';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { Stats } from '../../components/Stats/Stats';
import { generatePath, paths } from '../paths';
import { Avatar } from '../../components/Avatar/Avatar';

interface Props {
  identity: Identity;
}

export function RemoveIdentity({ identity }: Props) {
  const t = browser.i18n.getMessage;

  const history = useHistory();
  const { data: identities } = useIdentities();

  const handleClick = useCallback(async () => {
    if (!identities) {
      return;
    }

    const addresses = map(identities, 'address');
    const remaining = without(addresses, identity.address);
    const firstAddress = remaining[0];
    const path = firstAddress
      ? generatePath(paths.identity.overview, { address: firstAddress })
      : paths.home;
    history.push(path);

    await removeIdentity(identity);
  }, [history, identity, identities]);

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>{t('view_RemoveIdentity_heading')}</h1>
      <p className={styles.subline}>{t('view_RemoveIdentity_subline')}</p>

      <Avatar identity={identity} />
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
