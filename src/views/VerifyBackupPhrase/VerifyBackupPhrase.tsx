import { Link } from 'react-router-dom';
import { browser } from 'webextension-polyfill-ts';

import styles from './VerifyBackupPhrase.module.css';

interface VerifyBackupPhraseProps {
  backupPhrase: string;
}

function shuffle(array: string[]) {
  let m = array.length,
    t,
    i;

  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

export function VerifyBackupPhrase({
  backupPhrase,
}: VerifyBackupPhraseProps): JSX.Element {
  const words = backupPhrase.split(/\s+/);
  const shuffledWords = shuffle([...words]);
  const shuffledPhrase = shuffledWords.join(' ');
  const t = browser.i18n.getMessage;

  return (
    <section className={styles.container}>
      <Link to="/account/create/backup" className={styles.backButton}>
        {t('common_action_back')}
      </Link>
      <h1>{t('view_VerifyBackupPhrase_heading')}</h1>
      <p>{t('view_VerifyBackupPhrase_explanation')}</p>
      <p>{backupPhrase}</p>
      <p>{shuffledPhrase}</p>
      <p>
        <Link to="/">{t('common_action_cancel')}</Link>{' '}
        <Link to="/account/create/password">{t('common_action_next')}</Link>
      </p>
    </section>
  );
}
