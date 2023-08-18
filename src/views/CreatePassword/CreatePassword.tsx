import { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import browser from 'webextension-polyfill';
import { Link } from 'react-router-dom';

import * as styles from './CreatePassword.module.css';

import { LinkBack } from '../../components/LinkBack/LinkBack';
import { usePasswordType } from '../../components/usePasswordType/usePasswordType';
import { paths } from '../paths';

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
  return value.length >= MIN_LENGTH;
}

function isNotExample(value: string): boolean {
  return value !== browser.i18n.getMessage('view_CreatePassword_example');
}

function getComplexityClassName(password: string): string {
  const complexity = [
    hasBothCases(password),
    hasNumber(password),
    hasOther(password),
    isLong(password),
    isNotExample(password),
  ].filter(Boolean).length;

  const classNames = [
    styles.complexityNone,
    styles.complexityNone,
    styles.complexityPoor,
    styles.complexityMedium,
    styles.complexityGood,
    styles.complexityOk,
  ];

  return classNames[complexity];
}

interface Props {
  onSuccess: (password: string) => void;
}

export function CreatePassword({ onSuccess }: Props) {
  const t = browser.i18n.getMessage;

  const [password, setPassword] = useState('');
  const modified = password !== '';
  const { passwordType, passwordToggle } = usePasswordType();

  const handleInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  }, []);

  const error =
    modified &&
    [
      !hasBothCases(password) && t('view_CreatePassword_error_cases'),
      !hasNumber(password) && t('view_CreatePassword_error_numbers'),
      !hasOther(password) && t('view_CreatePassword_error_other'),
      !isLong(password) &&
        t('view_CreatePassword_error_length', [String(MIN_LENGTH)]),
      !isNotExample(password) && t('view_CreatePassword_error_example'),
    ].filter(Boolean)[0];

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      if (modified && !error) {
        onSuccess(password);
      }
    },
    [error, modified, onSuccess, password],
  );

  function makeClasses(validator: (value: string) => boolean) {
    const pass = validator(password);
    return modified && pass ? styles.pass : undefined;
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>{t('view_CreatePassword_heading')}</h1>
      <p className={styles.subline}>
        {t('view_CreatePassword_explanation')}{' '}
        {t('view_CreatePassword_example')}
      </p>

      <h2 className={styles.criteriaHeading}>
        {t('view_CreatePassword_criteria')}
      </h2>
      <ul className={styles.criteria}>
        <li className={makeClasses(hasBothCases)}>
          {t('view_CreatePassword_criteria_cases')}
        </li>
        <li className={makeClasses(hasOther)}>
          {t('view_CreatePassword_criteria_other')}
        </li>
        <li className={makeClasses(isLong)}>
          {t('view_CreatePassword_criteria_length')}
        </li>
        <li className={makeClasses(hasNumber)}>
          {t('view_CreatePassword_criteria_numbers')}
        </li>
        <li className={makeClasses(isNotExample)}>
          {t('view_CreatePassword_criteria_example')}
        </li>
      </ul>

      <form onSubmit={handleSubmit}>
        <p className={styles.inputLine}>
          <input
            className={styles.input}
            onInput={handleInput}
            type={passwordType}
            name="password"
            autoComplete="new-password"
            autoFocus
            required
            minLength={MIN_LENGTH}
            aria-label={t('view_CreatePassword_label')}
            placeholder={t('view_CreatePassword_label')}
          />

          {passwordToggle}

          <output className={styles.errorTooltip} hidden={!error}>
            {error}
          </output>
        </p>

        <div
          className={`${styles.complexity} ${getComplexityClassName(password)}`}
        >
          <div className={styles.lock} />
        </div>

        <p>
          <Link to={paths.home} className={styles.cancel}>
            {t('common_action_cancel')}
          </Link>

          <button
            className={styles.submit}
            type="submit"
            disabled={!modified || Boolean(error)}
          >
            {t('view_CreatePassword_CTA')}
          </button>
        </p>
      </form>

      <LinkBack />
    </main>
  );
}
