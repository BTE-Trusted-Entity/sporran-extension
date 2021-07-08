import { Link } from 'react-router-dom';
import { browser } from 'webextension-polyfill-ts';

import { Identity } from '../../utilities/identities/types';
import { IdentitySlide } from '../../components/IdentitySlide/IdentitySlide';
import { Stats } from '../../components/Stats/Stats';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { paths } from '../paths';

import tableStyles from '../../components/Table/Table.module.css';
import styles from './IdentityCredentials.module.css';

interface Props {
  identity: Identity;
}

export function IdentityCredentials({ identity }: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  const credentials: {
    Name: string;
    'Credential type': string;
    Attester: string;
    valid: boolean;
  }[] = [];

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
            <tr key={credential.Name} className={tableStyles.tr}>
              <td className={tableStyles.td}>{credential.Name}</td>
              <td className={tableStyles.td}>
                {credential['Credential type']}
              </td>
              <td className={tableStyles.td}>{credential.Attester}</td>
              <td
                className={credential.valid ? styles.valid : tableStyles.td}
                aria-label={
                  credential.valid
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
