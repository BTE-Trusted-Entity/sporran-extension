import { useCallback, useState } from 'react';
import DEFAULT_WORDLIST from '@polkadot/util-crypto/mnemonic/bip39-en';
import { Identity } from '@kiltprotocol/core';
import { SDKErrors } from '@kiltprotocol/utils';
import { browser } from 'webextension-polyfill-ts';
import { Link, useHistory } from 'react-router-dom';

import styles from './ImportBackupPhrase.module.css';

export const RelevantSDKErrors = [
  SDKErrors.ErrorCode.ERROR_MNEMONIC_PHRASE_INVALID,
  SDKErrors.ErrorCode.ERROR_MNEMONIC_PHRASE_MALFORMED,
];

export function ImportBackupPhrase(): JSX.Element {
  const t = browser.i18n.getMessage;
  const [error, setError] = useState({ isError: false, name: '', value: '' });
  const history = useHistory();
  const [mnemonicObject, setMnemonicObject] = useState({
    one: '',
    two: '',
    three: '',
    four: '',
    five: '',
    six: '',
    seven: '',
    eight: '',
    nine: '',
    ten: '',
    eleven: '',
    twelve: '',
  });
  const [mnemonic, setMnemonic] = useState<string>();
  const handleAdd = useCallback(
    (event) => {
      const { name, value } = event.target;
      const wordlist = DEFAULT_WORDLIST.includes(value);
      if (!wordlist && value.length > 0) {
        setError({ isError: true, name, value });
      } else {
        setError({ ...error, isError: false });
        setMnemonicObject({ ...mnemonicObject, [name]: value });
      }
    },
    [mnemonicObject, error],
  );

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const mnemonicString = Object.values(mnemonicObject).join(' ');
      try {
        Identity.buildFromMnemonic(mnemonicString);
        setMnemonic(mnemonicString);
        history.push('/account/create/password');
      } catch (e) {
        if (
          SDKErrors.isSDKError(e) &&
          RelevantSDKErrors.includes(e.errorCode)
        ) {
          setError({ isError: true, value: e.message, name: '' });
        } else {
          console.log('This Error is very wrong', e);
        }
      }
    },
    [history, mnemonicObject],
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
          {Object.keys(mnemonicObject).map((value, index) => (
            <label key={index}>
              {index + 1} {'.'}
              <input
                className={styles.item}
                name={value}
                type="text"
                onInput={handleAdd}
              />
            </label>
          ))}
        </div>
        {error.isError &&
          `You have an error here: ${error.name} ${error.value}`}
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
