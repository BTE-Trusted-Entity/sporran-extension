import browser from 'webextension-polyfill';
import { Link, useHistory } from 'react-router-dom';

import * as styles from './DidDowngradeWarningWeb3Name.module.css';

import { Identity } from '../../utilities/identities/types';
import { generatePath, paths } from '../paths';

import { LinkBack } from '../../components/LinkBack/LinkBack';
import { Stats } from '../../components/Stats/Stats';
import { Avatar } from '../../components/Avatar/Avatar';
import { useWeb3Name } from '../../utilities/useWeb3Name/useWeb3Name';

interface Props {
  identity: Identity;
}

export function DidDowngradeWarningWeb3Name({ identity }: Props) {
  const t = browser.i18n.getMessage;

  const { goBack } = useHistory();

  const { address, did } = identity;

  const web3name = useWeb3Name(did);

  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>
        {t('view_DidDowngradeWarningWeb3Name_heading')}
      </h1>
      <p className={styles.subline}>
        {t('view_DidDowngradeWarningWeb3Name_subline')}
      </p>

      <Avatar identity={identity} />

      <p className={styles.warning}>
        {t('view_DidDowngradeWarningWeb3Name_warning')}
      </p>

      <p className={styles.details}>
        <span className={styles.label}>
          {t('view_DidDowngradeWarningWeb3Name_web3name')}
        </span>
        {web3name}
      </p>

      <p className={styles.explanation}>
        {t('view_DidDowngradeWarningWeb3Name_explanation')}
      </p>

      <p className={styles.buttonsLine}>
        <button onClick={goBack} className={styles.cancel}>
          {t('common_action_cancel')}
        </button>
        <Link
          to={generatePath(
            paths.identity.did.manage.downgrade.warning.credentials,
            { address },
          )}
          className={styles.cta}
        >
          {t('common_action_continue')}
        </Link>
      </p>

      <LinkBack />
      <Stats />
    </section>
  );
}
