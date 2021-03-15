import { useCallback, useState } from 'react';
import DEFAULT_WORDLIST from '@polkadot/util-crypto/mnemonic/bip39-en';
import { browser } from 'webextension-polyfill-ts';
import { Link } from 'react-router-dom';
import styles from './ImportBackupPhrase.module.css';

export function ImportBackupPhrase(): JSX.Element {
  const t = browser.i18n.getMessage;
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

  const handleInput = useCallback(
    (event) => {
      const name = event.target.name;
      const value = event.target.value;
      const checker = DEFAULT_WORDLIST.includes(value);
      if (!checker) {
        console.log('bad');
      } else {
        setMnemonicObject({ ...mnemonicObject, [name]: value });
      }
    },
    [setMnemonicObject, mnemonicObject],
  );

  console.log('I am the mnemonic', JSON.stringify(mnemonicObject));

  return (
    <section className={styles.container}>
      <div>
        <h3>[Insert logo here]</h3>
      </div>
      <h1>{t('view_ImportBackupPhrase_heading')}</h1>
      <p>{t('view_ImportBackupPhrase_explanation')}</p>

      <form className={styles.items}>
        {Object.keys(mnemonicObject).map((value, index) => (
          <label key={index}>
            {index + 1} {'.'}
            <input
              className={styles.item}
              name={value}
              type="text"
              onInput={handleInput}
            />
          </label>
        ))}
      </form>

      <p>
        <Link to="/account/create/password">
          {t('view_SaveBackupPhrase_CTA')}
        </Link>
      </p>
      <p>
        <Link to="/">{t('common_action_back')}</Link>
      </p>
      <p>
        <Link to="/">{t('common_action_cancel')}</Link>
      </p>
    </section>
  );
}
