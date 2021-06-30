import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { browser } from 'webextension-polyfill-ts';

import {
  endpoints,
  getEndpoint,
  setEndpoint,
} from '../../utilities/endpoints/endpoints';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { paths } from '../paths';

import styles from './AppSettings.module.css';

export function AppSettings(): JSX.Element {
  const t = browser.i18n.getMessage;

  const [endpointValue, setEndpointValue] = useState('');
  useEffect(() => {
    (async () => {
      const current = await getEndpoint();
      setEndpointValue(current);
    })();
  }, []);

  const handleEndpointInput = useCallback(async (event) => {
    setEndpointValue(event.target.value);
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      await setEndpoint(endpointValue);
    },
    [endpointValue],
  );

  const handleReset = useCallback(async () => {
    setEndpointValue(endpoints[0]);
  }, []);

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h1 className={styles.heading}>{t('view_AppSettings_heading')}</h1>
      <p className={styles.subline}>{t('view_AppSettings_subline')}</p>

      <p className={styles.subline}>{t('view_AppSettings_warning')}</p>
      <p className={styles.subline}>{t('view_AppSettings_attention')}</p>

      <p className={styles.endpointLine}>
        <datalist id="endpoints">
          {endpoints.map((value) => (
            <option value={value} key={value} />
          ))}
        </datalist>
        <input
          className={styles.endpoint}
          type="url"
          pattern="wss?://.*"
          name="endpoint"
          list="endpoints"
          onInput={handleEndpointInput}
          value={endpointValue}
          required
          aria-label={t('view_AppSettings_endpoint')}
          placeholder={t('view_AppSettings_endpoint_placeholder')}
          autoFocus
        />

        <button
          className={styles.save}
          type="submit"
          aria-label={t('common_action_save')}
          title={t('common_action_save')}
        />
        <Link
          to={paths.home}
          className={styles.cancel}
          type="button"
          aria-label={t('common_action_cancel')}
          title={t('common_action_cancel')}
        />
      </p>

      <button className={styles.reset} type="button" onClick={handleReset}>
        {t('view_AppSettings_reset')}
      </button>

      <LinkBack />
    </form>
  );
}
