import { useCallback, useEffect, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';

import { useAccounts } from '../../utilities/accounts/accounts';
import { Avatar } from '../../components/Avatar/Avatar';
import { usePasswordType } from '../../components/usePasswordType/usePasswordType';
import { getPassword } from '../../connection/SavedPasswordsMessages/SavedPasswordsMessages';
import { getSignTxResult } from '../../dApps/SignTxMessages/SignTxMessages';
import {
  signPopupMessages,
  useSignPopupQuery,
} from '../../dApps/SignPopupMessages/SignPopupMessages';

import styles from './SignDApp.module.css';

export function SignDApp(): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const query = useSignPopupQuery();

  /*
    const values = [
      { value: query.blockHash, label: t('view_SignDApp_from') }, // TODO
      { value: query.genesisHash, label: t('view_SignDApp_genesis') },
      {
        value: parseInt(query.specVersion, 16),
        label: t('view_SignDApp_version'),
      },
      { value: query.nonce, label: t('view_SignDApp_nonce') },
      { value: query.method, label: t('view_SignDApp_method') },
      { value: query.era, label: t('view_SignDApp_lifetime') },
    ];
  */

  const { passwordType, passwordToggle } = usePasswordType();
  const [error, setError] = useState<string | null>(null);

  const handlePasswordInput = useCallback(() => {
    setError(null);
  }, []);

  const [remember, setRemember] = useState(false);

  const toggleRemember = useCallback(() => {
    setRemember(!remember);
  }, [remember]);

  const [savedPassword, setSavedPassword] = useState<string | undefined>();

  const accounts = useAccounts().data;
  const account = accounts && accounts[query.address as string];

  useEffect(() => {
    (async () => {
      if (!account) {
        return;
      }
      const password = await getPassword(account.address);
      setSavedPassword(password);
      setRemember(Boolean(password));
    })();
  }, [account]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      const { elements } = event.target;
      const providedPassword = elements.password.value;
      const password =
        providedPassword === '************' && savedPassword
          ? savedPassword
          : providedPassword;

      const signed = await getSignTxResult({ password, payload: query });
      await signPopupMessages(signed);

      window.close();
    },
    [query, savedPassword],
  );

  const handleCancelClick = useCallback(async () => {
    window.close();
  }, []);

  if (!account) {
    return null;
  }

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h1 className={styles.heading}>{t('view_SignDApp_title')}</h1>

      <Avatar
        tartan={account.tartan}
        address={account.address}
        className={styles.tartan}
      />
      <h2 className={styles.account}>{account.name}</h2>

      {/*<dl className={styles.details}>
        {values.map(({ label, value }) => (
          <Fragment key={label}>
            <dt className={styles.detailName}>{label}:</dt>
            <dd className={styles.detailValue}>{value}</dd>
          </Fragment>
        ))}
      </dl>*/}

      <label className={styles.passwordLabel} htmlFor="password">
        {t('view_SignDApp_password')}
      </label>

      <p className={styles.passwordLine}>
        <input
          type={passwordType}
          onInput={handlePasswordInput}
          id="password"
          name="password"
          className={styles.password}
          defaultValue={savedPassword ? '************' : undefined}
          autoFocus
        />
        {passwordToggle}

        <output className={styles.errorTooltip} hidden={!error}>
          {error}
        </output>
      </p>

      <label className={styles.rememberLabel}>
        <span>{t('view_SignDApp_remember')}</span>
        <input
          type="checkbox"
          name="remember"
          className={styles.remember}
          checked={remember}
          onChange={toggleRemember}
        />
        <span />
      </label>

      <p className={styles.buttonsLine}>
        <button
          onClick={handleCancelClick}
          type="button"
          className={styles.reject}
        >
          {t('view_SignDApp_reject')}
        </button>
        <button type="submit" className={styles.submit}>
          {t('view_SignDApp_CTA')}
        </button>
      </p>
    </form>
  );
}
