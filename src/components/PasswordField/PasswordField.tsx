import {
  Dispatch,
  FormEvent,
  Fragment,
  JSX,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Link } from 'react-router-dom';
import browser from 'webextension-polyfill';
import { KiltKeyringPair, Utils } from '@kiltprotocol/sdk-js';

import * as styles from './PasswordField.module.css';

import { decryptIdentity } from '../../utilities/identities/identities';
import { usePasswordType } from '../usePasswordType/usePasswordType';
import { useInterval } from '../../utilities/useInterval/useInterval';
import {
  forgetPasswordChannel,
  getPasswordChannel,
  savePasswordChannel,
} from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels';
import { RouteExcept } from '../RouteExcept/RouteExcept';
import { generatePath, paths } from '../../views/paths';
import { PasswordError } from '../../utilities/storageEncryption/storageEncryption';

export { PasswordError } from '../../utilities/storageEncryption/storageEncryption';

// Okay, ESLint, I must have a parameter but cannot use it
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function defaultGetPassword(event: FormEvent): Promise<Value> {
  throw new Error('Not initialized yet, getPassword not set');
}

// To store a function in state I have to use this workaround since proper typing was not provided
// https://github.com/DefinitelyTyped/DefinitelyTyped/pull/38160
type SetPasswordGetterType = Dispatch<
  SetStateAction<(event: FormEvent) => Promise<Value>>
>;

interface Value {
  password: string;
  keypair: KiltKeyringPair;
  seed: Uint8Array;
}

export function usePasswordField(): {
  get: (event: FormEvent) => Promise<Value>;
  set: (getter: (event: FormEvent) => Promise<Value>) => void;
} {
  const [passwordGetter, setPasswordGetter] = useState(
    () => defaultGetPassword,
  );

  return useMemo(
    () => ({
      get: passwordGetter,
      set: setPasswordGetter,
    }),
    [passwordGetter],
  );
}

const asterisks = '************';

interface Props {
  identity: { address: string };
  autoFocus?: boolean;
  password: {
    set: (getter: (event: FormEvent) => Promise<Value>) => void;
  };
}

export function PasswordField({
  identity: { address },
  autoFocus,
  password,
}: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const setPasswordGetter = password.set as SetPasswordGetterType;

  const rememberRef = useRef<HTMLInputElement>(null);

  const [savedPassword, setSavedPassword] = useState<string | undefined>();

  const [error, setError] = useState<string | null>(null);

  const passwordGetter = useCallback(
    async (event: FormEvent) => {
      if (!address) {
        throw new Error('No identity address');
      }

      const target = event.target as unknown as {
        elements: Record<string, HTMLInputElement>;
      };

      const providedPassword = target.elements.password.value;
      const useSaved = savedPassword && providedPassword === asterisks;
      const password = useSaved ? savedPassword : providedPassword;

      if (!password) {
        setError(t('component_PasswordField_required'));
        throw new PasswordError('No password');
      }

      let seed: Uint8Array;
      try {
        seed = await decryptIdentity(address, password);
      } catch (exception) {
        if (exception instanceof PasswordError) {
          setError(t('component_PasswordField_password_incorrect'));
        }
        throw exception;
      }

      if (rememberRef.current?.checked) {
        await savePasswordChannel.get({ password, address });
      } else {
        await forgetPasswordChannel.get(address);
      }

      const keypair = Utils.Crypto.makeKeypairFromSeed(seed, 'sr25519');
      return { password, keypair, seed };
    },
    [address, rememberRef, savedPassword, t],
  );

  const handlePasswordInput = useCallback(() => {
    setError(null);
    setPasswordGetter(() => passwordGetter);
  }, [passwordGetter, setPasswordGetter]);

  const getSavedPassword = useCallback(async () => {
    if (!address || !rememberRef.current) {
      return;
    }
    const passwordString = await getPasswordChannel.get(address);
    setSavedPassword(passwordString);

    rememberRef.current.checked = Boolean(passwordString);

    setPasswordGetter(() => passwordGetter);
  }, [address, passwordGetter, setPasswordGetter]);

  useInterval(getSavedPassword, 1 * 60 * 1000);

  useEffect(() => {
    getSavedPassword();
  }, [getSavedPassword]);

  const { passwordType, passwordToggle } = usePasswordType();

  return (
    <Fragment>
      <p className={styles.resetLine}>
        <label className={styles.passwordLabel} htmlFor="password">
          {t('component_PasswordField_password')}
        </label>

        <RouteExcept path={paths.popup.base}>
          <Link
            to={generatePath(paths.identity.reset.start, { address })}
            className={styles.reset}
          >
            {t('component_PasswordField_reset')}
          </Link>
        </RouteExcept>
      </p>

      <p className={styles.passwordLine}>
        <input
          type={passwordType}
          onInput={handlePasswordInput}
          id="password"
          name="password"
          className={styles.password}
          defaultValue={savedPassword ? asterisks : undefined}
          autoFocus={autoFocus}
        />
        {passwordToggle}

        <output className={styles.errorTooltip} hidden={!error}>
          {error}
        </output>
      </p>

      <label className={styles.rememberLabel}>
        <span>{t('component_PasswordField_remember')}</span>
        <input
          type="checkbox"
          name="remember"
          className={styles.remember}
          ref={rememberRef}
        />
        <span />
      </label>
    </Fragment>
  );
}
