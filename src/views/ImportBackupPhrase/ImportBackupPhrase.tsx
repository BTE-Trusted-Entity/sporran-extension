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

const STATUS = {
  pass: styles.pass,
  fail: styles.fail,
  neutral: styles.neutral,
};

type BackupPhraseObject = {
  [key: string]: {
    backupPhrase: string;
    style: string;
  };
};

interface Props {
  importBackupPhrase: (val: string) => void;
}

const wordlistLibrary = (value: string) => {
  return DEFAULT_WORDLIST.includes(value);
};

export function ImportBackupPhrase({ importBackupPhrase }: Props): JSX.Element {
  const t = browser.i18n.getMessage;
  const [error, setError] = useState({ isError: false, name: '', value: '' });
  const [
    backupPhraseObject,
    setBackupPhraseObject,
  ] = useState<BackupPhraseObject>({
    '1': { backupPhrase: '', style: STATUS.neutral },
    '2': { backupPhrase: '', style: STATUS.neutral },
    '3': { backupPhrase: '', style: STATUS.neutral },
    '4': { backupPhrase: '', style: STATUS.neutral },
    '5': { backupPhrase: '', style: STATUS.neutral },
    '6': { backupPhrase: '', style: STATUS.neutral },
    '7': { backupPhrase: '', style: STATUS.neutral },
    '8': { backupPhrase: '', style: STATUS.neutral },
    '9': { backupPhrase: '', style: STATUS.neutral },
    '10': { backupPhrase: '', style: STATUS.neutral },
    '11': { backupPhrase: '', style: STATUS.neutral },
    '12': { backupPhrase: '', style: STATUS.neutral },
  });

  const errors = [
    error.isError &&
      error.name === '30008' &&
      t('view_ImportBackupPhrase_error_invalid_backup_phrase'),
    error.isError &&
      error.name === '20012' &&
      t('view_ImportBackupPhrase_error_backup_phrase_length'),
    error.isError &&
      t('view_ImportBackupPhrase_error_invalid_word', [
        error.name,
        error.value,
      ]),
  ].filter(Boolean)[0];

  const handleInput = useCallback(
    (event) => {
      const { name, value } = event.target;
      const word = wordlistLibrary(value);

      if (word) {
        setError({ ...error, isError: false });
        setBackupPhraseObject({
          ...backupPhraseObject,
          [name]: { backupPhrase: value, style: STATUS.pass },
        });
      } else if (value.length === 0) {
        setError({ ...error, isError: false });
        setBackupPhraseObject({
          ...backupPhraseObject,
          [name]: { backupPhrase: value, style: STATUS.neutral },
        });
      } else {
        setError({ isError: true, name, value });
        setBackupPhraseObject({
          ...backupPhraseObject,
          [name]: { backupPhrase: value, style: STATUS.fail },
        });
      }
    },
    [backupPhraseObject, error],
  );

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const mnemonicString = Object.values(backupPhraseObject)
        .map((val) => val.backupPhrase)
        .join(' ');
      try {
        Identity.buildFromMnemonic(mnemonicString);
        importBackupPhrase(mnemonicString);
      } catch (e) {
        if (
          SDKErrors.isSDKError(e) &&
          RelevantSDKErrors.includes(e.errorCode)
        ) {
          setError({ isError: true, name: `${e.errorCode}`, value: e.message });
        } else {
          setError({ isError: true, name: '', value: e });
        }
      }
    },
    [importBackupPhrase, backupPhraseObject],
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
            <div key={index} className={styles.item}>
              <li className={backupPhraseObject[wordIndex].style}>
                {index + 1}
                <input
                  name={wordIndex}
                  className={styles.input}
                  type="text"
                  onInput={handleInput}
                  value={backupPhraseObject[wordIndex].backupPhrase}
                />
              </li>
            </div>
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
