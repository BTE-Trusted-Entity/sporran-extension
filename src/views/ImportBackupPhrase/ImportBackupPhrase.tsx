import { ChangeEventHandler, useCallback, useState } from 'react';
import DEFAULT_WORDLIST from '@polkadot/util-crypto/mnemonic/bip39-en';
import { Identity } from '@kiltprotocol/core';
import { browser } from 'webextension-polyfill-ts';

import { useErrorTooltip } from '../../components/useErrorMessage/useErrorTooltip';
import { LinkBack } from '../../components/LinkBack/LinkBack';

import styles from './ImportBackupPhrase.module.css';

type BackupPhrase = string[];

function isAllowed(word: string) {
  return DEFAULT_WORDLIST.includes(word);
}

function isInvalid(
  backupPhrase: BackupPhrase,
  expectedAddress?: string,
): string | null {
  const t = browser.i18n.getMessage;
  try {
    const { address } = Identity.buildFromMnemonic(backupPhrase.join(' '));

    const noNeedToCompare = !expectedAddress;
    const matchesExpectations = expectedAddress === address;
    if (noNeedToCompare || matchesExpectations) {
      return null;
    }

    return t('view_ImportBackupPhrase_error_mismatched_backup_phrase');
  } catch {
    return t('view_ImportBackupPhrase_error_invalid_backup_phrase');
  }
}

function isMalformed(backupPhrase: BackupPhrase): string | null {
  const length = backupPhrase.filter(Boolean).length;
  const hasNoWords = length === 0;
  const hasAllWords = length === 12;
  const allIsFine = hasAllWords || hasNoWords;
  if (allIsFine) {
    return null;
  }
  const t = browser.i18n.getMessage;
  return t('view_ImportBackupPhrase_error_backup_phrase_length');
}

interface WordInputProps {
  word: string;
  index: number;
  handleInput: ChangeEventHandler<HTMLInputElement>;
}

function WordInput({ word, index, handleInput }: WordInputProps): JSX.Element {
  const t = browser.i18n.getMessage;

  const hasError = Boolean(word && !isAllowed(word)); // to be reused in JSX below
  const errorTooltip = useErrorTooltip(hasError);

  return (
    <li className={styles.item} {...errorTooltip.anchor}>
      <input
        aria-label={(index + 1).toString()}
        id={index.toString()}
        name={index.toString()}
        className={styles.input}
        type="text"
        onInput={handleInput}
      />
      {hasError && (
        <output htmlFor={index.toString()} {...errorTooltip.tooltip}>
          {t('view_ImportBackupPhrase_error_typo')}
          <span {...errorTooltip.pointer} />
        </output>
      )}
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
}: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  const [modified, setModified] = useState(false);
  const [backupPhrase, setBackupPhrase] = useState<BackupPhrase>(
    Array(12).fill(''),
  );

  const error =
    modified &&
    [
      isMalformed(backupPhrase),
      isInvalid(backupPhrase, type === 'reset' ? address : undefined),
    ].filter(Boolean)[0];

  const errorTooltip = useErrorTooltip(Boolean(error));

  const handleInput = useCallback(
    (event) => {
      const { name, value } = event.target;
      backupPhrase[name] = value.trim().toLowerCase();
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
            />
          ))}
        </ol>

        <button
          type="submit"
          className={styles.button}
          disabled={Boolean(error) || backupPhrase.join('') === ''}
          {...errorTooltip.anchor}
        >
          {t('common_action_next')}
        </button>
        <output {...errorTooltip.tooltip}>
          {error}
          <span {...errorTooltip.pointer} />
        </output>
      </form>

      <LinkBack />
    </section>
  );
}
