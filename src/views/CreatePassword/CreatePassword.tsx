import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import { browser } from 'webextension-polyfill-ts';

import styles from './CreatePassword.module.css';

function hasUpperCase(value: string): boolean {
  return /\p{Upper}/u.test(value);
}

function hasLowerCase(value: string): boolean {
  return /\p{Lower}/u.test(value);
}

function hasBothCases(value: string): boolean {
  return hasUpperCase(value) && hasLowerCase(value);
}

function hasNumber(value: string): boolean {
  return /\p{Number}/u.test(value);
}

function hasOther(value: string): boolean {
  return /[^\p{Upper}\p{Lower}\p{Number}]/u.test(value);
}

const MIN_LENGTH = 12;

function isLong(value: string): boolean {
  return value.length > MIN_LENGTH;
}

function isNotExample(value: string): boolean {
  return value !== browser.i18n.getMessage('view_CreatePassword_example');
}

interface Props {
  onSuccess: (val: string) => void;
}

export function CreatePassword({ onSuccess }: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  const [password, setPassword] = useState('');
  const [modified, setModified] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleInput = useCallback((event) => {
    setPassword(event.target.value);
    setModified(true);
  }, []);

  const error = [
    modified && !hasBothCases(password) && t('view_CreatePassword_error_cases'),
    modified && !hasNumber(password) && t('view_CreatePassword_error_numbers'),
    modified && !hasOther(password) && t('view_CreatePassword_error_other'),
    modified &&
      !isLong(password) &&
      t('view_CreatePassword_error_length', [MIN_LENGTH]),
    modified &&
      !isNotExample(password) &&
      t('view_CreatePassword_error_example'),
  ].filter(Boolean)[0];
  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      if (!modified || error) {
        return;
      }
      onSuccess(password);
    },
    [error, modified, onSuccess, password],
  );

  const handleHideClick = useCallback(() => {
    setVisible(false);
  }, []);

  const handleShowClick = useCallback(() => {
    setVisible(true);
  }, []);

  function makeClasses(validator: (value: string) => boolean) {
    const pass = validator(password);
    return cx(
      modified && {
        [styles.pass]: pass,
        [styles.fail]: !pass,
      },
    );
  }

  return (
    <main>
      <h1>{t('view_CreatePassword_heading')}</h1>
      <p>{t('view_CreatePassword_per_account')}</p>

      <p>
        {t('view_CreatePassword_explanation')}{' '}
        <code>{t('view_CreatePassword_example')}</code>
      </p>

      <ul>
        <li className={makeClasses(hasBothCases)}>
          {t('view_CreatePassword_criteria_cases')}
        </li>
        <li className={makeClasses(hasNumber)}>
          {t('view_CreatePassword_criteria_numbers')}
        </li>
        <li className={makeClasses(hasOther)}>
          {t('view_CreatePassword_criteria_other')}
        </li>
        <li className={makeClasses(isLong)}>
          {t('view_CreatePassword_criteria_length')}
        </li>
        <li className={makeClasses(isNotExample)}>
          {t('view_CreatePassword_criteria_example')}
        </li>
      </ul>

      <form onSubmit={handleSubmit}>
        <label>
          {t('view_CreatePassword_label')}
          <input
            onInput={handleInput}
            type={visible ? 'text' : 'password'}
            name="password"
            autoComplete="new-password"
            required
            minLength={MIN_LENGTH}
          />
        </label>

        {visible ? (
          <button type="button" onClick={handleHideClick}>
            {t('view_CreatePassword_hide')}
          </button>
        ) : (
          <button type="button" onClick={handleShowClick}>
            {t('view_CreatePassword_show')}
          </button>
        )}

        <p className={styles.errors}>{error}</p>
        <button type="submit">{t('view_CreatePassword_CTA')}</button>
      </form>

      <p>
        <Link to="/account/create/backup">{t('common_action_back')}</Link>
      </p>
    </main>
  );
}
