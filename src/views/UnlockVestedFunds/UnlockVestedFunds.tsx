import { useState, useCallback, useEffect } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { Link, useHistory } from 'react-router-dom';

import { Identity } from '../../utilities/identities/types';
import { decryptIdentity } from '../../utilities/identities/identities';
import { paths, generatePath } from '../paths';

import {
  getPasswordChannel,
  savePasswordChannel,
  forgetPasswordChannel,
} from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels';
import {
  vestChannel,
  insufficientFunds,
} from '../../channels/VestingChannels/VestingChannels';

import { Avatar } from '../../components/Avatar/Avatar';
import { usePasswordType } from '../../components/usePasswordType/usePasswordType';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { Stats } from '../../components/Stats/Stats';

import styles from './UnlockVestedFunds.module.css';

interface Props {
  identity: Identity;
}

export function UnlockVestedFunds({ identity }: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  const history = useHistory();

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
      const password = await getPasswordChannel.get(identity.address);
      setSavedPassword(password);
      setRemember(Boolean(password));
    })();
  }, [identity]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      const { address } = identity;

      const { elements } = event.target;
      const providedPassword = elements.password.value;
      const password =
        providedPassword === '************' && savedPassword
          ? savedPassword
          : providedPassword;

      try {
        await decryptIdentity(address, password);

        if (remember) {
          await savePasswordChannel.get({ password, address });
        } else {
          await forgetPasswordChannel.get(address);
        }

        await vestChannel.get({ address, password });

        history.push(generatePath(paths.identity.overview, { address }));
      } catch (error) {
        console.error(error);
        if (error.name === 'OperationError') {
          setError(t('view_UnlockVestedFunds_password_incorrect'));
        }
        if (error.message === insufficientFunds) {
          setError(t('view_UnlockVestedFunds_insufficient_funds'));
        }
      }
    },
    [t, identity, savedPassword, remember, history],
  );

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.container}
      autoComplete="off"
    >
      <h1 className={styles.heading}>{t('view_UnlockVestedFunds_heading')}</h1>
      <p className={styles.subline}>{t('view_UnlockVestedFunds_subline')}</p>

      <Avatar address={identity.address} className={styles.avatar} />
      <p className={styles.name}>{identity.name}</p>

      <p className={styles.explanation}>
        {t('view_UnlockVestedFunds_explanation')}
      </p>

      <p className={styles.resetLine}>
        <label className={styles.passwordLabel} htmlFor="password">
          {t('view_UnlockVestedFunds_password')}
        </label>

        <Link
          to={generatePath(paths.identity.reset.start, {
            address: identity.address,
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
