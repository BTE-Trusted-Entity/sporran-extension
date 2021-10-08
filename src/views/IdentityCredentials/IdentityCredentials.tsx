import { Link } from 'react-router-dom';
import { browser } from 'webextension-polyfill-ts';

import { Identity } from '../../utilities/identities/types';
import { IdentitySlide } from '../../components/IdentitySlide/IdentitySlide';
import { Stats } from '../../components/Stats/Stats';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { useIdentityCredentials } from '../../utilities/credentials/credentials';
import { paths } from '../paths';

import tableStyles from '../../components/Table/Table.module.css';
import styles from './IdentityCredentials.module.css';

interface Props {
  identity: Identity;
}

export function IdentityCredentials({ identity }: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const credentials = useIdentityCredentials(identity.did);
  if (!credentials) {
    return null; // storage data pending
  }

  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>{t('view_IdentityCredentials_title')}</h1>
      <p className={styles.subline}>{t('view_IdentityCredentials_subline')}</p>

      <IdentitySlide identity={identity} />

      <table className={styles.credentials}>
        <thead>
          <tr className={tableStyles.tr}>
            <th className={tableStyles.th}>
              {t('view_IdentityCredentials_name')}
            </th>
            <th className={tableStyles.th}>
              {t('view_IdentityCredentials_ctype')}
            </th>
            <th className={tableStyles.th}>
              {t('view_IdentityCredentials_attester')}
            </th>
            <th className={tableStyles.th}>
              {t('view_IdentityCredentials_valid')}
            </th>
          </tr>
        </thead>
        <tbody>
          {credentials.map((credential) => (
            <tr key={credential.name} className={tableStyles.tr}>
              <td className={tableStyles.td}>{credential.name}</td>
              <td className={tableStyles.td}>{credential.cTypeTitle}</td>
              <td className={tableStyles.td}>{credential.attester}</td>
              <td
                className={
                  credential.isAttested ? styles.valid : tableStyles.td
                }
                aria-label={
                  credential.isAttested
                    ? t('view_IdentityCredentials_valid')
                    : undefined
                }
              />
            </tr>
          ))}
        </tbody>
      </table>

      <p>
        <Link to={paths.home} className={styles.close}>
          {t('common_action_close')}
        </Link>
      </p>

      <LinkBack />
      <Stats />
    </section>
  );
}
