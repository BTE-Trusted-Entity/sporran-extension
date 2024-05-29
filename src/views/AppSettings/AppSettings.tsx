import { FormEvent, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import browser from 'webextension-polyfill';

import * as styles from './AppSettings.module.css';

import {
  defaultEndpoint,
  endpoints,
  getStoredEndpoint,
  publicEndpoints,
  setEndpoint,
} from '../../utilities/endpoints/endpoints';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { useConfiguration } from '../../configuration/useConfiguration';
import { paths } from '../paths';

export function AppSettings() {
  const t = browser.i18n.getMessage;

  const { features } = useConfiguration();

  const [endpointValue, setEndpointValue] = useState<string[]>([]);
  useEffect(() => {
    (async () => {
      const current = await getStoredEndpoint();
      setEndpointValue(current);
    })();
  }, []);

  const handleEndpointInput = useCallback(
    async (
      event: FormEvent<HTMLInputElement> | FormEvent<HTMLSelectElement>,
    ) => {
      const target = event.currentTarget;
      if ('selectedOptions' in target) {
        setEndpointValue(
          Array.from(target.selectedOptions).map(({ value }) => value),
        );
      } else {
        setEndpointValue([target.value]);
      }
    },
    [],
  );

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      await setEndpoint(endpointValue);
    },
    [endpointValue],
  );

  const handleReset = useCallback(async () => {
    setEndpointValue([defaultEndpoint]);
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

        {features.endpoint && (
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
        )}

        {!features.endpoint && (
          <select
            className={styles.endpoint}
            name="endpoint"
            onInput={handleEndpointInput}
            value={endpointValue}
            aria-label={t('view_AppSettings_endpoint')}
            autoFocus
            multiple={true}
          >
            {Object.entries(publicEndpoints).map(([label, value]) => (
              <option label={label} value={value} key={value} />
            ))}
          </select>
        )}

        <button
          className={styles.save}
          type="submit"
          aria-label={t('common_action_save')}
          title={t('common_action_save')}
        />
        <Link
          to={paths.home}
          className={styles.cancel}
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
