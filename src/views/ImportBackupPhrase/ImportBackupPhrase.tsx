import { useCallback, useState } from 'react';
import DEFAULT_WORDLIST from '@polkadot/util-crypto/mnemonic/bip39-en';
import { Identity } from '@kiltprotocol/core';
import { SDKErrors } from '@kiltprotocol/utils';
import { browser } from 'webextension-polyfill-ts';
import { Link } from 'react-router-dom';

import styles from './ImportBackupPhrase.module.css';

export const RelevantSDKErrors = [
  SDKErrors.ErrorCode.ERROR_MNEMONIC_PHRASE_INVALID,
  SDKErrors.ErrorCode.ERROR_MNEMONIC_PHRASE_MALFORMED,
];

const ERROR_CODE_INVALID_BACKUP_PHRASE = '30008';
const ERROR_CODE_BACKUP_PHRASE_MALFORMED = '20012';

const STATUS = {
  pass: styles.pass,
  fail: styles.fail,
  neutral: styles.neutral,
};

type BackupPhraseObject = {
  [key: string]: {
    backupWord: string;
    style: string;
  };
};

interface Props {
  onImport: (backupPhrase: string) => void;
}

const isAllowed = (word: string) => {
  return DEFAULT_WORDLIST.includes(word);
};

export function ImportBackupPhrase({ onImport }: Props): JSX.Element {
  const t = browser.i18n.getMessage;
  const [error, setError] = useState({ isError: false, name: '', message: '' });
  const [
    backupPhraseObject,
    setBackupPhraseObject,
  ] = useState<BackupPhraseObject>({
    '1': { backupWord: '', style: STATUS.neutral },
    '2': { backupWord: '', style: STATUS.neutral },
    '3': { backupWord: '', style: STATUS.neutral },
    '4': { backupWord: '', style: STATUS.neutral },
    '5': { backupWord: '', style: STATUS.neutral },
    '6': { backupWord: '', style: STATUS.neutral },
    '7': { backupWord: '', style: STATUS.neutral },
    '8': { backupWord: '', style: STATUS.neutral },
    '9': { backupWord: '', style: STATUS.neutral },
    '10': { backupWord: '', style: STATUS.neutral },
    '11': { backupWord: '', style: STATUS.neutral },
    '12': { backupWord: '', style: STATUS.neutral },
  });

  const errors = [
    error.isError &&
      error.name === ERROR_CODE_INVALID_BACKUP_PHRASE &&
      t('view_ImportBackupPhrase_error_invalid_backup_phrase'),
    error.isError &&
      error.name === ERROR_CODE_BACKUP_PHRASE_MALFORMED &&
      t('view_ImportBackupPhrase_error_backup_phrase_length'),
    error.isError &&
      t('view_ImportBackupPhrase_error_invalid_word', [
        error.name,
        error.message,
      ]),
  ].filter(Boolean)[0];

  const handleInput = useCallback(
    (event) => {
      const { name, value } = event.target;
      const word = isAllowed(value);

      if (word) {
        setError({ ...error, isError: false });
        setBackupPhraseObject({
          ...backupPhraseObject,
          [name]: { backupWord: value, style: STATUS.pass },
        });
      } else if (value.length === 0) {
        setError({ ...error, isError: false });
        setBackupPhraseObject({
          ...backupPhraseObject,
          [name]: { backupWord: value, style: STATUS.neutral },
        });
      } else {
        setError({ isError: true, name, message: value });
        setBackupPhraseObject({
          ...backupPhraseObject,
          [name]: { backupWord: value, style: STATUS.fail },
        });
      }
    },
    [backupPhraseObject, error],
  );

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const backupPhraseString = Object.values(backupPhraseObject)
        .map(({ backupWord }) => backupWord)
        .join(' ');
      try {
        Identity.buildFromMnemonic(backupPhraseString);
        onImport(backupPhraseString);
      } catch (error) {
        if (
          SDKErrors.isSDKError(error) &&
          RelevantSDKErrors.includes(error.errorCode)
        ) {
          setError({
            isError: true,
            name: `${error.errorCode}`,
            message: error.message,
          });
        } else {
          setError({ isError: true, name: '', message: error });
        }
      }
    },
    [onImport, backupPhraseObject],
  );

  return (
    <section className={styles.container}>
      <div>
        <h3>[Insert logo here]</h3>
      </div>
      <h1>{t('view_ImportBackupPhrase_heading')}</h1>
      <p>{t('view_ImportBackupPhrase_explanation')}</p>

      <form onSubmit={handleSubmit}>
        <ul className={styles.items}>
          {Object.keys(backupPhraseObject).map((wordIndex, index) => (
            <li key={index} className={backupPhraseObject[wordIndex].style}>
              <label className={styles.item}>
                {index + 1}
                <input
                  name={wordIndex}
                  className={styles.input}
                  type="text"
                  onInput={handleInput}
                  value={backupPhraseObject[wordIndex].backupWord}
                />
              </label>
            </li>
          ))}
        </ul>
        {error.isError && <p className={styles.errors}>{errors}</p>}
        <div className={styles.buttonContainer}>
          <button type="submit">{t('view_ImportBackupPhrase_submit')}</button>
        </div>
      </form>

      <p>
        <Link to="/">{t('common_action_back')}</Link>
      </p>
      <p>
        <Link to="/">{t('common_action_cancel')}</Link>
      </p>
    </section>
  );
}
