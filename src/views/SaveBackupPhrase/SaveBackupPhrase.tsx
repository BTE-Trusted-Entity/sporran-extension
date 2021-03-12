import { browser } from 'webextension-polyfill-ts';

import styles from './SaveBackupPhrase.module.css';

interface Props {
  backupPhrase: string;
}

export function SaveBackupPhrase({ backupPhrase }: Props): JSX.Element {
  const words = backupPhrase.split(/\s+/);
  const t = browser.i18n.getMessage;

  return (
    <section>
      <h1>{t('views_SaveBackupPhrase_heading')}</h1>
      <p>{t('views_SaveBackupPhrase_explanation')}</p>

      <div className={styles.items}>
        {words.map((word, index) => (
          <button key={word} className={styles.item}>
            {index + 1}
            {'. '}
            <span className={styles.word}>{word}</span>
          </button>
        ))}
      </div>

      <p>
        <a href="/">{t('views_SaveBackupPhrase_CTA')}</a>
      </p>
      <p>
        <a href="/">{t('common_action_back')}</a>
      </p>
      <p>
        <a href="/">{t('common_action_cancel')}</a>
      </p>
    </section>
  );
}
