import { browser } from 'webextension-polyfill-ts';
import { Link } from 'react-router-dom';

import { LinkBack } from '../../components/LinkBack/LinkBack';
import { paths } from '../paths';

import styles from './SaveBackupPhrase.module.css';

interface Props {
  backupPhrase: string;
}

export function SaveBackupPhrase({ backupPhrase }: Props): JSX.Element {
  const words = backupPhrase.split(/\s+/);
  const t = browser.i18n.getMessage;

  return (
    <section className={styles.container}>
      <h1>{t('view_SaveBackupPhrase_heading')}</h1>
      <p>{t('view_SaveBackupPhrase_explanation')}</p>

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
        <Link to={paths.account.create.verify}>{t('common_action_next')}</Link>
      </p>
      <p>
        <Link to={paths.home}>{t('common_action_cancel')}</Link>
      </p>

      <LinkBack />
    </section>
  );
}
