import { useState, useCallback, useEffect } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { Link } from 'react-router-dom';

import { Account } from '../../utilities/accounts/types';
import { decryptAccount } from '../../utilities/accounts/accounts';
import { paths, generatePath } from '../paths';
import {
  getPassword,
  savePassword,
  forgetPassword,
} from '../../connection/SavedPasswordsMessages/SavedPasswordsMessages';

import { Avatar } from '../../components/Avatar/Avatar';
import { usePasswordType } from '../../components/usePasswordType/usePasswordType';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { Stats } from '../../components/Stats/Stats';

import styles from './UnlockVestedFunds.module.css';
import { vest } from '../../connection/VestingMessages/VestingMessages';

interface Props {
  account: Account;
}

export function UnlockVestedFunds({ account }: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  const { passwordType, passwordToggle } = usePasswordType();

  const [savedPassword, setSavedPassword] = useState<string | undefined>();

  const [error, setError] = useState<string | null>(null);

  const [remember, setRemember] = useState(false);

  const toggleRemember = useCallback(() => {
    setRemember(!remember);
  }, [remember]);

  const handlePasswordInput = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    (async () => {
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

      try {
        await decryptAccount(account.address, password);

        if (remember) {
          savePassword(password, account.address);
        } else {
          forgetPassword(account.address);
        }

        await vest(account.address, password);
      } catch (error) {
        setError(t('view_UpdateVestedFunds_password_incorrect'));
      }
    },
    [t, account, savedPassword, remember],
  );

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.container}
      autoComplete="off"
    >
      <h1 className={styles.heading}>{t('view_UnlockVestedFunds_heading')}</h1>
      <p className={styles.subline}>{t('view_UnlockVestedFunds_subline')}</p>

      <Avatar
        tartan={account.tartan}
        address={account.address}
        className={styles.avatar}
      />
      <p className={styles.name}>{account.name}</p>

      <p className={styles.explanation}>
        {t('view_UnlockVestedFunds_explanation')}
      </p>

      <p className={styles.resetLine}>
        <label className={styles.passwordLabel} htmlFor="password">
          {t('view_UnlockVestedFunds_password')}
        </label>

        <Link
          to={generatePath(paths.account.reset.start, {
            address: account.address,
          })}
          className={styles.reset}
        >
          {t('view_UnlockVestedFunds_reset')}
        </Link>
      </p>

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
        <span>{t('view_UnlockVestedFunds_remember')}</span>
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
        <Link to={paths.home} className={styles.cancel}>
          {t('common_action_cancel')}
        </Link>
        <button type="submit" className={styles.submit}>
          {t('view_UnlockVestedFunds_CTA')}
        </button>
      </p>

      <LinkBack />
      <Stats />
    </form>
  );
}
