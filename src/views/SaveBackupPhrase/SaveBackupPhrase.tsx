import browser from 'webextension-polyfill';
import { Link } from 'react-router-dom';

import * as styles from './SaveBackupPhrase.module.css';

import { LinkBack } from '../../components/LinkBack/LinkBack';
import { paths } from '../paths';

interface Props {
  backupPhrase: string;
}

export function SaveBackupPhrase({ backupPhrase }: Props) {
  const words = backupPhrase.split(/\s+/);
  const t = browser.i18n.getMessage;

  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>{t('view_SaveBackupPhrase_heading')}</h1>
      <p className={styles.subheading}>
        {t('view_SaveBackupPhrase_explanation')}
      </p>

      <ol className={styles.items}>
        {words.map((word, index) => (
          <li key={index} className={styles.item}>
            <span className={styles.word}>{word}</span>
          </li>
        ))}
      </ol>

      <div className={styles.buttons}>
        <Link to={paths.home} className={styles.cancel}>
          {t('common_action_cancel')}
        </Link>
        <Link to={paths.identity.create.verify} className={styles.create}>
          {t('common_action_next')}
        </Link>
      </div>

      <LinkBack />
    </section>
  );
}
