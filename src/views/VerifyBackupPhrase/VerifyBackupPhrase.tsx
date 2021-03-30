import { useState, useCallback, MouseEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import cx from 'classnames';
import { browser } from 'webextension-polyfill-ts';

import { paths } from '../paths';

import styles from './VerifyBackupPhrase.module.css';

interface Props {
  backupPhrase: string;
}

type Word = { value: string | null; id: number };

// Fisher-Yates algorithm
// https://stackoverflow.com/a/12646864/14715116
function shuffle(array: string[]): string[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function VerifyBackupPhrase({ backupPhrase }: Props): JSX.Element {
  const t = browser.i18n.getMessage;
  const history = useHistory();

  const orderedWords = backupPhrase.split(/\s+/);

  const initialShuffledWords: Word[] = [];
  shuffle([...orderedWords]).map((word, index) => {
    initialShuffledWords.push({ value: word, id: index });
  });

  const [selectedWords, setSelectedWords] = useState<Word[]>([]);
  const [shuffledWords] = useState<Word[]>(initialShuffledWords);

  const wordsAreInOrder = selectedWords.every(
    (word, index) => word.value === orderedWords[index],
  );

  const allWordsSelected = selectedWords.length === orderedWords.length;

  const error = !wordsAreInOrder && t('view_VerifyBackupPhrase_error');

  const selectWord = useCallback(
    (wordId: number) => (event: MouseEvent<HTMLButtonElement>) => {
      const selectedWord: Word = {
        value: event.currentTarget.textContent,
        id: wordId,
      };
      setSelectedWords([...selectedWords, selectedWord]);
    },
    [selectedWords],
  );

  const unselectWord = useCallback(
    (wordId: number) => () => {
      setSelectedWords(selectedWords.filter((word) => word.id !== wordId));
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
              key={word.id}
              className={cx(styles.button, {
                [styles.incorrect]: word.value !== orderedWords[index],
                [styles.correct]: word.value === orderedWords[index],
              })}
              onClick={unselectWord(word.id)}
            >
              {word.value}
            </button>
          ))}
        </div>
        <hr />
        {shuffledWords.map((word) => (
          <button
            type="button"
            disabled={
              selectedWords.filter(
                (selectedWord) => selectedWord.id === word.id,
              ).length > 0
            }
            key={word.id}
            className={styles.button}
            onClick={selectWord(word.id)}
          >
            {word.value}
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
