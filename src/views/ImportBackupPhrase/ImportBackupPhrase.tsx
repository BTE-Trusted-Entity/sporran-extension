import { useCallback, useState } from 'react';
import DEFAULT_WORDLIST from '@polkadot/util-crypto/mnemonic/bip39-en';
import { Identity } from '@kiltprotocol/core';
import { browser } from 'webextension-polyfill-ts';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import styles from './ImportBackupPhrase.module.css';

function isAllowed(word: string) {
  return DEFAULT_WORDLIST.includes(word);
}

function filterArray<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

function ERROR_INVALID_BACKUP_PHRASE(value: string): boolean {
  try {
    Identity.buildFromMnemonic(value);
    return true;
  } catch {
    return false;
  }
}
function ERROR_BACKUP_PHRASE_MALFORMED(value: Array<string>): boolean {
  const filteredArray = value.filter(filterArray);
  if (filteredArray.length > 0 && filteredArray.length < 12) return false;
  return true;
}
function ERROR_INVALID_BACKUP_WORD(value: string): boolean {
  return isAllowed(value);
}

type BackupPhrase = Array<string>;

interface Props {
  onImport: (backupPhrase: string) => void;
}

export function ImportBackupPhrase({ onImport }: Props): JSX.Element {
  const t = browser.i18n.getMessage;
  const [modified, setModified] = useState(false);
  const [backupPhrase, setBackupPhrase] = useState<BackupPhrase>([
    ...Array(12),
  ]);

  const error = [
    // modified &&
    //   !ERROR_INVALID_BACKUP_WORD(backupPhrase[2]) &&
    //   t('view_ImportBackupPhrase_error_invalid_word', [
    //     backupPhrase.indexOf(backupPhrase[2]),
    //     backupPhrase[2],
    //   ]),
    modified &&
      !ERROR_BACKUP_PHRASE_MALFORMED(backupPhrase) &&
      t('view_ImportBackupPhrase_error_backup_phrase_length'),
    modified &&
      !ERROR_INVALID_BACKUP_PHRASE(
        backupPhrase.map((word) => word).join(' '),
      ) &&
      t('view_ImportBackupPhrase_error_invalid_backup_phrase'),
  ].filter(Boolean)[0];

  const handleInput = useCallback(
    (event) => {
      const { name, value } = event.target;
      backupPhrase[name] = value;
      setBackupPhrase([...backupPhrase]);
      setModified(true);
    },
    [backupPhrase],
  );

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      if (error) {
        return;
      }
      const backupPhraseString = backupPhrase.map((word) => word).join(' ');
      onImport(backupPhraseString);
    },
    [backupPhrase, error, onImport],
  );

  // function makeClasses(validator: (value: string) => boolean) {
  //   const filteredArray = backupPhrase.filter(filterArray);
  //   return filteredArray.map((val) => {
  //     const homer = validator(val);
  //     return cx({
  //       [styles.neutral]: !modified,
  //       [styles.pass]: homer && modified,
  //       [styles.fail]: !homer && modified,
  //     });
  //   });
  // }

  return (
    <section className={styles.container}>
      <div>
        <h3>[Insert logo here]</h3>
      </div>
      <h1>{t('view_ImportBackupPhrase_heading')}</h1>
      <p>{t('view_ImportBackupPhrase_explanation')}</p>

      <form onSubmit={handleSubmit}>
        <ul className={styles.items}>
          {backupPhrase.map((_, index) => (
            <li
              key={index}
              // className={makeClasses(ERROR_INVALID_BACKUP_WORD)}
            >
              <label className={styles.item}>
                {index + 1}
                <input
                  name={index.toString()}
                  className={styles.input}
                  type="text"
                  onInput={handleInput}
                />
              </label>
            </li>
          ))}
        </ul>
        {error && <p className={styles.errors}>{error}</p>}
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
