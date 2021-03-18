import { useState, useEffect, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import cx from 'classnames';
import { browser } from 'webextension-polyfill-ts';

import styles from './VerifyBackupPhrase.module.css';

interface VerifyBackupPhraseProps {
  backupPhrase: string;
}

// Fisher-Yates algorithm
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array?answertab=votes#tab-top
export function shuffle(array: string[]): string[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function VerifyBackupPhrase({
  backupPhrase,
}: VerifyBackupPhraseProps): JSX.Element {
  const [orderedWords, setOrderedWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [error, setError] = useState('');

  const t = browser.i18n.getMessage;

  const history = useHistory();

  useEffect(() => {
    const words = backupPhrase.split(/\s+/);
    setOrderedWords(words);
    setShuffledWords(shuffle([...words]));
  }, [backupPhrase]);

  useEffect(() => {
    if (
      selectedWords.length === 0 ||
      selectedWords.every((word, index) => word === orderedWords[index])
    ) {
      setError('');
    } else {
      setError(t('view_VerifyBackupPhrase_error_info'));
    }
  }, [selectedWords, orderedWords, t]);

  const selectWord = useCallback(
    (event) => {
      const selectedWord = event.target.value;
      setSelectedWords([...selectedWords, selectedWord]);
      setShuffledWords(shuffledWords.filter((word) => word !== selectedWord));
    },
    [selectedWords, shuffledWords],
  );

  const unselectWord = useCallback(
    (event) => {
      const unselectedWord = event.target.value;
      setSelectedWords(selectedWords.filter((word) => word !== unselectedWord));
      setShuffledWords([...shuffledWords, unselectedWord]);
    },
    [selectedWords, shuffledWords],
  );

  const handleSubmit = useCallback(() => {
    if (
      selectedWords.length !== orderedWords.length ||
      selectedWords.some((word, index) => word !== orderedWords[index])
    ) {
      setError(t('view_VerifyBackupPhrase_error_instruction'));
    } else {
      history.push('/account/create/password');
    }
  }, [orderedWords, selectedWords, history, t]);

  return (
    <section className={styles.container}>
      <Link to="/account/create/backup" className={styles.backButton}>
        {t('common_action_back')}
      </Link>
      <h1>{t('view_VerifyBackupPhrase_heading')}</h1>
      <h3>{t('view_VerifyBackupPhrase_explanation')}</h3>
      <div>
        {selectedWords.map((word, index) => (
          <button
            key={index}
            value={word}
            className={cx(styles.button, {
              [styles.incorrect]: word !== orderedWords[index],
              [styles.correct]: word === orderedWords[index],
            })}
            onClick={unselectWord}
          >
            {word}
            <span className={styles.booleanSymbol}>
              {word !== orderedWords[index] ? '❌' : '✔'}
            </span>
          </button>
        ))}
      </div>
      <hr />
      <div>
        {shuffledWords.map((word, index) => (
          <button
            value={word}
            key={index}
            className={styles.button}
            onClick={selectWord}
          >
            {word}
          </button>
        ))}
      </div>
      <p className={styles.error}>{error}</p>
      <button onClick={handleSubmit}>{t('common_action_next')}</button>
      <p>
        <Link to="/">{t('common_action_cancel')}</Link>{' '}
      </p>
    </section>
  );
}
