import { useCallback, useState } from 'react';
import DEFAULT_WORDLIST from '@polkadot/util-crypto/mnemonic/bip39-en';
import { Identity } from '@kiltprotocol/core';
import { browser } from 'webextension-polyfill-ts';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import { paths } from '../paths';

import styles from './ImportBackupPhrase.module.css';

type BackupPhrase = string[];

function isAllowed(word: string) {
  return DEFAULT_WORDLIST.includes(word);
}

function INVALID_BACKUP_PHRASE(backupPhrase: BackupPhrase): boolean {
  try {
    Identity.buildFromMnemonic(backupPhrase.join(' '));
    return false;
  } catch {
    return true;
  }
}

function BACKUP_PHRASE_MALFORMED(backupPhrase: BackupPhrase): boolean {
  const length = backupPhrase.filter(Boolean).length;
  const hasNoWords = length === 0;
  const hasAllWords = length === 12;
  const allIsFine = hasAllWords || hasNoWords;
  return !allIsFine;
}

function INVALID_BACKUP_WORD(value: string): boolean {
  return !isAllowed(value);
}

interface Props {
  onImport: (backupPhrase: string) => void;
}

export function ImportBackupPhrase({ onImport }: Props): JSX.Element {
  const t = browser.i18n.getMessage;
  const [modified, setModified] = useState(false);
  const [backupPhrase, setBackupPhrase] = useState<BackupPhrase>(
    Array(12).fill(''),
  );

  function HAS_INVALID_WORD(backupPhrase: BackupPhrase): string | null {
    const invalidWord = backupPhrase.find(INVALID_BACKUP_WORD);

    if (!invalidWord) {
      return null;
    }

    const invalidWordIndex = backupPhrase.indexOf(invalidWord);
    return t('view_ImportBackupPhrase_error_invalid_word', [
      invalidWordIndex + 1,
      invalidWord,
    ]);
  }

  const error = [
    modified && HAS_INVALID_WORD(backupPhrase),
    modified &&
      BACKUP_PHRASE_MALFORMED(backupPhrase) &&
      t('view_ImportBackupPhrase_error_backup_phrase_length'),
    modified &&
      INVALID_BACKUP_PHRASE(backupPhrase) &&
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
      const backupPhraseString = backupPhrase.join(' ');
      onImport(backupPhraseString);
    },
    [backupPhrase, error, onImport],
  );

  function makeClasses(word: string): string {
    const empty = word === '';
    const allowed = isAllowed(word);
    return cx({
      [styles.neutral]: empty,
      [styles.pass]: !empty && allowed,
      [styles.fail]: !empty && !allowed,
    });
  }

  return (
    <section className={styles.container}>
      <div>
        <h3>[Insert logo here]</h3>
      </div>
      <h1>{t('view_ImportBackupPhrase_heading')}</h1>
      <p>{t('view_ImportBackupPhrase_explanation')}</p>

      <form onSubmit={handleSubmit} autoComplete="off">
        <ul className={styles.items}>
          {backupPhrase.map((word, index) => (
            <li key={index} className={makeClasses(word)}>
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
        {error && <p>{error}</p>}
        <div className={styles.buttonContainer}>
          <button type="submit">{t('view_ImportBackupPhrase_submit')}</button>
        </div>
      </form>

      <p>
        <Link to={paths.home}>{t('common_action_back')}</Link>
      </p>
      <p>
        <Link to={paths.home}>{t('common_action_cancel')}</Link>
      </p>
    </section>
  );
}
