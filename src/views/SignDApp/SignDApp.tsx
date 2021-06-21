import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';

import { decryptAccount, useAccounts } from '../../utilities/accounts/accounts';
import { Avatar } from '../../components/Avatar/Avatar';
import { usePasswordType } from '../../components/usePasswordType/usePasswordType';
import { useCopyButton } from '../../components/useCopyButton/useCopyButton';
import {
  forgetPasswordChannel,
  getPasswordChannel,
  savePasswordChannel,
} from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels';
import {
  backgroundSignChannel,
  useSignPopupQuery,
} from '../../dApps/SignChannels/backgroundSignChannel';

import styles from './SignDApp.module.css';

function formatBlock(block: number) {
  const locale = browser.i18n.getUILanguage();
  const formatter = new Intl.NumberFormat(locale, { useGrouping: true });
  return formatter.format(block);
}

function getExtrinsicValues({
  origin,
  specVersion,
  nonce,
  method,
  lifetimeStart,
  lifetimeEnd,
}: ReturnType<typeof useSignPopupQuery>) {
  const t = browser.i18n.getMessage;

  const lifetime =
    lifetimeStart && lifetimeEnd
      ? t('view_SignDApp_mortal', [
          formatBlock(lifetimeStart),
          formatBlock(lifetimeEnd),
        ])
      : t('view_SignDApp_immortal');

  return [
    { value: origin, label: t('view_SignDApp_from') },
    { value: specVersion, label: t('view_SignDApp_version') },
    { value: nonce, label: t('view_SignDApp_nonce') },
    { value: method, label: t('view_SignDApp_method') },
    { value: lifetime, label: t('view_SignDApp_lifetime') },
  ];
}

export function SignDApp(): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const query = useSignPopupQuery();
  const values = getExtrinsicValues(query);

  const addressRef = useRef<HTMLInputElement>(null);
  const copy = useCopyButton(addressRef);

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
      const password = await getPasswordChannel.get(account.address);
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

      if (!account) {
        return;
      }

      try {
        const { address } = account;
        await decryptAccount(address, password);

        if (remember) {
          await savePasswordChannel.get({ password, address });
        } else {
          await forgetPasswordChannel.get(account.address);
        }

        await backgroundSignChannel.return(password);

        window.close();
      } catch (error) {
        setError(t('view_SignDApp_password_incorrect'));
      }
    },
    [account, remember, savedPassword, t],
  );

  const handleCancelClick = useCallback(async () => {
    await backgroundSignChannel.throw('Rejected');
    window.close();
  }, []);

  if (!account) {
    return null;
  }

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h1 className={styles.heading}>{t('view_SignDApp_title')}</h1>

      <Avatar address={account.address} className={styles.avatar} />
      <h2 className={styles.account}>{account.name}</h2>

      <p className={styles.addressLine}>
        <input
          className={styles.address}
          ref={addressRef}
          readOnly
          value={account.address}
          aria-label={account.name}
        />
        {copy.supported && (
          <button
            className={copy.className}
            onClick={copy.handleCopyClick}
            type="button"
            aria-label={copy.title}
            title={copy.title}
          />
        )}
      </p>

      <dl className={styles.details}>
        {values.map(({ label, value }) => (
          <Fragment key={label}>
            <dt className={styles.detailName}>{label}:</dt>
            <dd className={styles.detailValue} title={String(value)}>
              {value}
            </dd>
          </Fragment>
        ))}
      </dl>

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
