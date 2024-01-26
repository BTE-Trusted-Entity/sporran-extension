import {
  ChangeEvent,
  ChangeEventHandler,
  ClipboardEvent,
  ClipboardEventHandler,
  FormEvent,
  useCallback,
  useState,
} from 'react';
import DEFAULT_WORDLIST from '@polkadot/util-crypto/mnemonic/wordlists/en';
import { mnemonicValidate } from '@polkadot/util-crypto';
import { Crypto } from '@kiltprotocol/utils';
import browser from 'webextension-polyfill';

import * as styles from './ImportBackupPhrase.module.css';

import { LinkBack } from '../../components/LinkBack/LinkBack';

type BackupPhrase = string[];

const noError = null;

function isAllowed(word: string) {
  return DEFAULT_WORDLIST.includes(word);
}

function isInvalid(
  backupPhrase: BackupPhrase,
  expectedAddress?: string,
): string | null {
  const t = browser.i18n.getMessage;

  const mnemonic = backupPhrase.join(' ');
  if (!mnemonicValidate(mnemonic)) {
    return t('view_ImportBackupPhrase_error_invalid_backup_phrase');
  }

  const { address } = Crypto.makeKeypairFromUri(mnemonic, 'sr25519');

  const noNeedToCompare = !expectedAddress;
  const matchesExpectations = expectedAddress === address;
  if (noNeedToCompare || matchesExpectations) {
    return noError;
  }

  return t('view_ImportBackupPhrase_error_mismatched_backup_phrase');
}

function isMalformed(backupPhrase: BackupPhrase): string | null {
  const length = backupPhrase.filter(Boolean).length;
  const hasNoWords = length === 0;
  const hasAllWords = length === 12;
  const allIsFine = hasAllWords || hasNoWords;
  if (allIsFine) {
    return noError;
  }
  const t = browser.i18n.getMessage;
  return t('view_ImportBackupPhrase_error_backup_phrase_length');
}

interface WordInputProps {
  word: string;
  index: number;
  handleInput: ChangeEventHandler<HTMLInputElement>;
  handlePaste?: ClipboardEventHandler<HTMLInputElement>;
}

function WordInput({ word, index, handleInput, handlePaste }: WordInputProps) {
  const t = browser.i18n.getMessage;

  const hasError = Boolean(word && !isAllowed(word));

  return (
    <li className={styles.item}>
      <input
        aria-label={(index + 1).toString()}
        id={index.toString()}
        name={index.toString()}
        className={styles.input}
        type="text"
        onInput={handleInput}
        onPaste={handlePaste}
        value={word}
        autoFocus={index === 0}
      />
      <output
        htmlFor={index.toString()}
        className={styles.wordErrorTooltip}
        hidden={!hasError}
      >
        {t('view_ImportBackupPhrase_error_typo')}
      </output>
    </li>
  );
}

interface Props {
  type?: 'import' | 'reset';
  address?: string;
  onImport: (backupPhrase: string) => void;
}

export function ImportBackupPhrase({
  type = 'import',
  address,
  onImport,
}: Props) {
  const t = browser.i18n.getMessage;

  const [backupPhrase, setBackupPhrase] = useState<BackupPhrase>(
    Array(12).fill(''),
  );
  const modified = backupPhrase.join('') !== '';

  const error =
    modified &&
    [
      isMalformed(backupPhrase),
      isInvalid(backupPhrase, type === 'reset' ? address : undefined),
    ].filter(Boolean)[0];

  const handleInput = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      backupPhrase[Number(name)] = value.trim().toLowerCase();
      setBackupPhrase([...backupPhrase]);
    },
    [backupPhrase],
  );

  const handlePaste = useCallback((event: ClipboardEvent) => {
    const text = event.clipboardData.getData('text');
    if (!text) {
      return;
    }
    const values = text.trim().split(/\s+/);
    if (values.length !== 12) {
      return;
    }
    setBackupPhrase(values);
    event.preventDefault();
  }, []);

  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      if (error) {
        return;
      }
      const backupPhraseString = backupPhrase.join(' ');
      onImport(backupPhraseString);
    },
    [backupPhrase, error, onImport],
  );

  return (
    <section className={styles.container}>
      {type === 'import' && (
        <>
          <h1 className={styles.heading}>
            {t('view_ImportBackupPhrase_heading_import')}
          </h1>
          <p className={styles.info}>
            {t('view_ImportBackupPhrase_explanation_import')}
          </p>
        </>
      )}
      {type === 'reset' && (
        <>
          <h1 className={styles.heading}>
            {t('view_ImportBackupPhrase_heading_reset')}
          </h1>
          <p className={styles.info}>
            {t('view_ImportBackupPhrase_explanation_reset')}
          </p>
        </>
      )}

      <form onSubmit={handleSubmit} autoComplete="off">
        <ol className={styles.items}>
          {backupPhrase.map((word, index) => (
            <WordInput
              key={index}
              word={word}
              index={index}
              handleInput={handleInput}
              handlePaste={index === 0 ? handlePaste : undefined}
            />
          ))}
        </ol>

        <p className={styles.buttonLine}>
          <button
            type="submit"
            className={styles.button}
            disabled={Boolean(error) || backupPhrase.join('') === ''}
          >
            {t('common_action_next')}
          </button>
          <output className={styles.errorTooltip} hidden={!error}>
            {error}
          </output>
        </p>
      </form>

      <LinkBack />
    </section>
  );
}
