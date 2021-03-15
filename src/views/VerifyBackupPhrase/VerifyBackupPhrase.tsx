import { Link } from 'react-router-dom';
import { browser } from 'webextension-polyfill-ts';

import styles from './VerifyBackupPhrase.module.css';

interface VerifyBackupPhraseProps {
  backupPhrase: string;
}

// Fisher-Yates algorithm
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array?answertab=votes#tab-top
function shuffle(array: string[]): string[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
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
      <h3>{t('view_VerifyBackupPhrase_explanation')}</h3>
      <p>{shuffledPhrase}</p>
      <p>
        <Link to="/">{t('common_action_cancel')}</Link>{' '}
        <Link to="/account/create/password">{t('common_action_next')}</Link>
      </p>
    </section>
  );
}
