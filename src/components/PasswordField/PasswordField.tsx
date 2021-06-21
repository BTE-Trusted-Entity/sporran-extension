import {
  Dispatch,
  FormEvent,
  Fragment,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Link } from 'react-router-dom';
import { browser } from 'webextension-polyfill-ts';

import { decryptAccount } from '../../utilities/accounts/accounts';
import { usePasswordType } from '../usePasswordType/usePasswordType';
import {
  forgetPasswordChannel,
  getPasswordChannel,
  savePasswordChannel,
} from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels';
import { RouteExcept } from '../RouteExcept/RouteExcept';
import { generatePath, paths } from '../../views/paths';

import styles from './PasswordField.module.css';

// Okay, ESLint, I must have a parameter but cannot use it
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function defaultGetPassword(event: FormEvent): Promise<string> {
  throw new Error('Not initialized yet, getPassword not set');
}

// To store a function in state I have to use this workaround since proper typing was not provided
// https://github.com/DefinitelyTyped/DefinitelyTyped/pull/38160
type SetGetPasswordType = Dispatch<
  SetStateAction<(event: FormEvent) => Promise<string>>
>;

export function usePasswordField(): {
  get: (event: FormEvent) => Promise<string>;
  set: (getter: (event: FormEvent) => Promise<string>) => void;
  isEmpty: boolean;
  setIsEmpty: (isEmpty: boolean) => void;
} {
  const [getPassword, setGetPassword] = useState(() => defaultGetPassword);
  const [isEmpty, setIsEmpty] = useState(true);

  return useMemo(
    () => ({
      get: getPassword,
      set: setGetPassword,
      isEmpty,
      setIsEmpty,
    }),
    [getPassword, isEmpty],
  );
}

const asterisks = '************';

interface Props {
  account: { address: string };
  autoFocus?: boolean;
  password: {
    set: (getter: (event: FormEvent) => Promise<string>) => void;
    setIsEmpty: (isEmpty: boolean) => void;
  };
}

export function PasswordField({
  account: { address },
  autoFocus,
  password,
}: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const { setIsEmpty } = password;
  const setGetPassword = password.set as SetGetPasswordType;

  const rememberRef = useRef<HTMLInputElement>(null);

  const [savedPassword, setSavedPassword] = useState<string | undefined>();

  const [error, setError] = useState<string | null>(null);

  const getPassword = useCallback(
    async (event) => {
      if (!address) {
        throw new Error('No account address');
      }

      const { elements } = event.target;
      const providedPassword = elements.password.value;
      const useSaved = savedPassword && providedPassword === asterisks;
      const password = useSaved ? savedPassword : providedPassword;

      try {
        await decryptAccount(address, password);
      } catch (error) {
        if (error.message === 'Invalid password') {
          setError(t('component_PasswordField_password_incorrect'));
        }
        throw error;
      }

      if (rememberRef.current?.checked) {
        await savePasswordChannel.get({ password, address });
      } else {
        await forgetPasswordChannel.get(address);
      }

      return password;
    },
    [address, rememberRef, savedPassword, t],
  );

  const handlePasswordInput = useCallback(
    (event) => {
      setError(null);
      setIsEmpty(event.target.value === '');
      setGetPassword(() => getPassword);
    },
    [getPassword, setGetPassword, setIsEmpty],
  );

  useEffect(() => {
    (async () => {
      if (!address || !rememberRef.current) {
        return;
      }
      const passwordString = await getPasswordChannel.get(address);
      setSavedPassword(passwordString);

      rememberRef.current.checked = Boolean(passwordString);
      setIsEmpty(!rememberRef.current.checked);

      setGetPassword(() => getPassword);
    })();
  }, [address, getPassword, setGetPassword, setIsEmpty]);

  const { passwordType, passwordToggle } = usePasswordType();

  return (
    <Fragment>
      <p className={styles.resetLine}>
        <label className={styles.passwordLabel} htmlFor="password">
          {t('component_PasswordField_password')}
        </label>

        <RouteExcept path={paths.popup.base}>
          <Link
            to={generatePath(paths.account.reset.start, { address })}
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
