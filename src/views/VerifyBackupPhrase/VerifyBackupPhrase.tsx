import { useState, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import cx from 'classnames';
import { browser } from 'webextension-polyfill-ts';

import { paths } from '../paths';

import styles from './VerifyBackupPhrase.module.css';

interface Props {
  backupPhrase: string;
}

export function VerifyBackupPhrase({ backupPhrase }: Props): JSX.Element {
  const t = browser.i18n.getMessage;
  const history = useHistory();

  const orderedWords = backupPhrase.split(/\s+/);

  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [sortedWords] = useState<string[]>([...orderedWords].sort());

  const wordsAreInOrder = selectedWords.every(
    (word, index) => word === orderedWords[index],
  );

  const allWordsSelected = selectedWords.length === orderedWords.length;

  const error = !wordsAreInOrder && t('view_VerifyBackupPhrase_error');

  const selectWord = useCallback(
    (event) => {
      const selectedWord = event.target.textContent;
      setSelectedWords([...selectedWords, selectedWord]);
    },
    [selectedWords],
  );

  const unselectWord = useCallback(
    (event) => {
      const unselectedWord = event.target.textContent;
      setSelectedWords(selectedWords.filter((word) => word !== unselectedWord));
    },
    [selectedWords],
  );

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      if (!allWordsSelected || error) {
        return;
      }
      history.push(paths.account.create.password);
    },
    [allWordsSelected, error, history],
  );

  return (
    <main className={styles.container}>
      <Link to={paths.account.create.backup} className={styles.backButton}>
        {t('common_action_back')}
      </Link>
      <h1>{t('view_VerifyBackupPhrase_heading')}</h1>
      <h3>{t('view_VerifyBackupPhrase_explanation')}</h3>

      <form onSubmit={handleSubmit}>
        <div className={styles.selectedWordsContainer}>
          {selectedWords.map((word, index) => (
            <button
              type="button"
              key={word}
              className={cx(styles.button, {
                [styles.incorrect]: word !== orderedWords[index],
                [styles.correct]: word === orderedWords[index],
              })}
              onClick={unselectWord}
            >
              {word}
            </button>
          ))}
        </div>
        <hr />
        {sortedWords.map((word) => (
          <button
            type="button"
            disabled={selectedWords.includes(word)}
            key={word}
            className={styles.button}
            onClick={selectWord}
          >
            {word}
          </button>
        ))}
        <p className={styles.error}>{error}</p>
        <button type="submit">{t('common_action_next')}</button>
      </form>

      <p>
        <Link to={paths.home}>{t('common_action_cancel')}</Link>
      </p>
    </main>
  );
}
