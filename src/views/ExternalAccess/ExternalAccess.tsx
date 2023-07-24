import { ChangeEvent, JSX, useCallback } from 'react';
import { Link } from 'react-router-dom';
import useSWR from 'swr';
import browser from 'webextension-polyfill';

import * as styles from './ExternalAccess.module.css';

import { LinkBack } from '../../components/LinkBack/LinkBack';
import {
  authorizedKey,
  getAuthorized,
  setAuthorized,
} from '../../utilities/authorizedStorage/authorizedStorage';
import { paths } from '../paths';

export function ExternalAccess(): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const hosts = useSWR(authorizedKey, getAuthorized).data;

  const handleChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      if (!hosts) {
        return;
      }

      const { name, checked } = event.target;

      hosts[name] = checked;
      await setAuthorized(hosts);
    },
    [hosts],
  );

  if (!hosts) {
    return null; // storage data pending
  }

  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>{t('view_ExternalAccess_heading')}</h1>
      <p className={styles.subline}>{t('view_ExternalAccess_subline')}</p>

      <small className={styles.small}>{t('view_ExternalAccess_small')}</small>

      <ul className={styles.list}>
        {Object.entries(hosts).map(([host, checked]) => (
          <li key={host}>
            <label className={styles.label}>
              <span className={styles.host}>{host}</span>
              <span className={styles.denied} aria-hidden>
                {t('view_ExternalAccess_denied')}
              </span>
              <input
                name={host}
                className={styles.toggle}
                type="checkbox"
                defaultChecked={checked}
                onChange={handleChange}
              />
              <span />
              <span className={styles.allowed} aria-hidden>
                {t('view_ExternalAccess_allowed')}
              </span>
            </label>
          </li>
        ))}
      </ul>

      <Link className={styles.back} to={paths.home}>
        {t('view_ExternalAccess_back')}
      </Link>

      <LinkBack />
    </section>
  );
}
