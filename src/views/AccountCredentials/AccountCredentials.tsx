import { Link } from 'react-router-dom';
import { browser } from 'webextension-polyfill-ts';

import { Account } from '../../utilities/accounts/types';
import { AccountSlide } from '../../components/AccountSlide/AccountSlide';
import { Stats } from '../../components/Stats/Stats';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { paths } from '../paths';

import tableStyles from '../../components/Table/Table.module.css';
import styles from './AccountCredentials.module.css';

interface Props {
  account: Account;
}

export function AccountCredentials({ account }: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  // TODO: use real data
  const credentials = [
    {
      Name: 'Email',
      'Full Name': 'Ingo Rübe',
      Email: 'ingo@kilt.io',
      'Credential type': 'BL-Mail-Simple',
      Attester: 'BOTLabs',
      valid: true,
    },
  ];

  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>{t('view_AccountCredentials_title')}</h1>
      <p className={styles.subline}>{t('view_AccountCredentials_subline')}</p>

      <AccountSlide account={account} />

      <table className={styles.credentials}>
        <thead>
          <tr className={tableStyles.tr}>
            <th className={tableStyles.th}>
              {t('view_AccountCredentials_name')}
            </th>
            <th className={tableStyles.th}>
              {t('view_AccountCredentials_ctype')}
            </th>
            <th className={tableStyles.th}>
              {t('view_AccountCredentials_attester')}
            </th>
            <th className={tableStyles.th}>
              {t('view_AccountCredentials_valid')}
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
