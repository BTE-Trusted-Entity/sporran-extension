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

type BackupPhraseObject = {
  [key: string]: {
    backupPhrase: string;
    style?: string;
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
    '1': { backupPhrase: '', style: '' },
    '2': { backupPhrase: '', style: '' },
    '3': { backupPhrase: '', style: '' },
    '4': { backupPhrase: '', style: '' },
    '5': { backupPhrase: '', style: '' },
    '6': { backupPhrase: '', style: '' },
    '7': { backupPhrase: '', style: '' },
    '8': { backupPhrase: '', style: '' },
    '9': { backupPhrase: '', style: '' },
    '10': { backupPhrase: '', style: '' },
    '11': { backupPhrase: '', style: '' },
    '12': { backupPhrase: '', style: '' },
  });

  const errors = [
    error.isError &&
      t('view_ImportBackupPhrase_error_invalid_word', [
        error.name,
        error.value,
      ]),
    error.isError &&
      error.value === '30008' &&
      t('view_ImportBackupPhrase_error_invalid_backup_phrase'),
    error.isError &&
      error.value === '20012' &&
      t('view_ImportBackupPhrase_error_backup_phrase_length'),
  ].filter(Boolean)[0];

  const handleAdd = useCallback(
    (event) => {
      const { name, value } = event.target;
      const word = wordlistLibrary(value);

      if (!word && value.length > 0) {
        setError({ isError: true, name, value });
        setBackupPhraseObject({
          ...backupPhraseObject,
          [name]: { style: styles.fail },
        });
      } else {
        setError({ ...error, isError: false });
        setBackupPhraseObject({
          ...backupPhraseObject,
          [name]: { backupPhrase: word, style: styles.pass },
        });
      }
    },
    [backupPhraseObject, error],
  );

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const mnemonicString = Object.values(backupPhraseObject).join(' ');
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
        <div className={styles.items}>
          {Object.keys(backupPhraseObject).map((value, index) => (
            <li key={index} className={backupPhraseObject[value].style}>
              {index + 1} {'.'}
              <input
                className={styles.item}
                name={value}
                type="text"
                onInput={handleAdd}
              />
            </li>
          ))}
        </div>
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
