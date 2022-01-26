import { browser } from 'webextension-polyfill-ts';
import { Link, Redirect, useHistory } from 'react-router-dom';

import * as styles from './DidDowngradeWarning.module.css';

import { Identity } from '../../utilities/identities/types';
import { generatePath, paths } from '../paths';

import { LinkBack } from '../../components/LinkBack/LinkBack';
import { Stats } from '../../components/Stats/Stats';
import { useIdentityCredentials } from '../../utilities/credentials/credentials';
import { CredentialCard } from '../../components/CredentialCard/CredentialCard';
import { Avatar } from '../../components/Avatar/Avatar';

interface Props {
  identity: Identity;
}

export function DidDowngradeWarning({ identity }: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const credentials = useIdentityCredentials(identity.did);

  const { goBack } = useHistory();

  if (!credentials) {
    return null; // storage data pending
  }

  if (credentials.length === 0) {
    return <Redirect to={paths.identity.did.manage.downgrade} />;
  }

  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>
        {t('view_DidDowngradeWarning_heading')}
      </h1>
      <p className={styles.subline}>{t('view_DidDowngradeWarning_subline')}</p>

      <Avatar identity={identity} />

      <p className={styles.warning}>{t('view_DidDowngradeWarning_warning')}</p>

      <ul className={styles.credentials}>
        {credentials.map((credential, index) => (
          <CredentialCard
            key={credential.request.rootHash}
            credential={credential}
            buttons={false}
            expand={index + 1 === credentials.length && credentials.length < 5}
          />
        ))}
      </ul>

      <p className={styles.buttonsLine}>
        <button onClick={goBack} className={styles.cancel}>
          {t('common_action_cancel')}
        </button>
        <Link
          to={generatePath(paths.identity.did.manage.downgrade, {
            address: identity.address,
          })}
          className={styles.cta}
        >
          {t('view_DidDowngradeWarning_CTA')}
        </Link>
      </p>

      <LinkBack />
      <Stats />
    </section>
  );
}
