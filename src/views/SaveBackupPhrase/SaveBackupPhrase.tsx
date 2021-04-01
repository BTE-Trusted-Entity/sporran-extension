import { browser } from 'webextension-polyfill-ts';
import { Link } from 'react-router-dom';

import { LinkBack } from '../../components/LinkBack/LinkBack';
import { paths } from '../paths';

import styles from './SaveBackupPhrase.module.css';

const formatCounter = (idx: number) =>
  idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`;

interface Props {
  backupPhrase: string;
}

export function SaveBackupPhrase({ backupPhrase }: Props): JSX.Element {
  const words = backupPhrase.split(/\s+/);
  const t = browser.i18n.getMessage;

  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>{t('view_SaveBackupPhrase_heading')}</h1>
      <p className={styles.subheading}>
        {t('view_SaveBackupPhrase_explanation')}
      </p>

      <div className={styles.items}>
        {words.map((word, index) => (
          <div key={word} className={styles.item}>
            <span className={styles.counter}>
              {formatCounter(index)}
              {'. '}
            </span>
            <span className={styles.word}>{word}</span>
            <span className={styles.eye} />
          </div>
        ))}
      </div>
      <div className={styles.buttons}>
        <Link to={paths.home} className={styles.cancel}>
          {t('common_action_cancel')}
        </Link>
        <Link to={paths.account.create.verify} className={styles.create}>
          {t('common_action_next')}
        </Link>
      </div>
      <LinkBack />
    </section>
  );
}
