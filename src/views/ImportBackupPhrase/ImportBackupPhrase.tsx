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

  const handleAdd = useCallback(
    (event) => {
      const { name, value } = event.target;
      const wordlist = DEFAULT_WORDLIST.includes(value);
      if (!wordlist && value.length > 0) {
        setError({ isError: true, name, value });
        setBackupPhraseObject({
          ...backupPhraseObject,
          [name]: { style: styles.fail },
        });
      } else {
        setError({ ...error, isError: false });
        setBackupPhraseObject({
          ...backupPhraseObject,
          [name]: { backupPhrase: value, style: styles.pass },
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
          setError({ isError: true, value: e.message, name: `${e.errorCode}` });
        } else {
          setError({ isError: true, value: e, name: '' });
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
        {error.isError &&
          `It looks like there’s a typo in word ${error.name}: [${error.value}]`}
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
