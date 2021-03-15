import { useCallback, useState } from 'react';
import DEFAULT_WORDLIST from '@polkadot/util-crypto/mnemonic/bip39-en';
import { browser } from 'webextension-polyfill-ts';
import { Link } from 'react-router-dom';
import styles from './ImportBackupPhrase.module.css';

export function ImportBackupPhrase(): JSX.Element {
  const t = browser.i18n.getMessage;
  const [mnemonic, setMnemonic] = useState([]);

  const handleInput = useCallback((event) => {
    const checker = DEFAULT_WORDLIST.includes(event.target.value);
    if (!checker) {
      console.log('bad');
    } else {
      setMnemonic(event.target.value);
    }
  }, []);

  return (
    <section className={styles.container}>
      <div>
        <h3>[Insert logo here]</h3>
      </div>
      <h1>{t('view_ImportBackupPhrase_heading')}</h1>
      <p>{t('view_ImportBackupPhrase_explanation')}</p>

      <form className={styles.items}>
        <label>
          1.
          <input className={styles.item} type="text" onInput={handleInput} />
        </label>
        <label>
          2.
          <input className={styles.item} type="text" onInput={handleInput} />
        </label>
        <label>
          3.
          <input className={styles.item} type="text" onInput={handleInput} />
        </label>
        <label>
          4.
          <input className={styles.item} type="text" onInput={handleInput} />
        </label>
        <label>
          5.
          <input className={styles.item} type="text" onInput={handleInput} />
        </label>
        <label>
          6.
          <input className={styles.item} type="text" onInput={handleInput} />
        </label>
        <label>
          7.
          <input className={styles.item} type="text" onInput={handleInput} />
        </label>
        <label>
          8.
          <input className={styles.item} type="text" onInput={handleInput} />
        </label>
        <label>
          9.
          <input className={styles.item} type="text" onInput={handleInput} />
        </label>
        <label>
          10.
          <input className={styles.item} type="text" onInput={handleInput} />
        </label>
        <label>
          11.
          <input className={styles.item} type="text" onInput={handleInput} />
        </label>
        <label>
          12.
          <input className={styles.item} type="text" onInput={handleInput} />
        </label>
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
