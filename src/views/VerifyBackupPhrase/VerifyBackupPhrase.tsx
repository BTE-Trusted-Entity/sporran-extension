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

  const expectedWords = backupPhrase.split(/\s+/);
  const selectableWords = [...expectedWords].sort();

  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);

  const wordsAreInOrder = selectedIndexes.every(
    (selectedIndex, index) =>
      selectableWords[selectedIndex] === expectedWords[index],
  );

  const allWordsSelected = selectedIndexes.length === expectedWords.length;

  const error = !wordsAreInOrder && t('view_VerifyBackupPhrase_error');

  const selectWord = useCallback(
    (event) => {
      const selectedIndex = parseInt(event.target.value, 10);
      setSelectedIndexes([...selectedIndexes, selectedIndex]);
    },
    [selectedIndexes],
  );

  const unselectWord = useCallback(
    (event) => {
      const unselectedIndex = parseInt(event.target.value, 10);
      setSelectedIndexes(
        selectedIndexes.filter((index) => index !== unselectedIndex),
      );
    },
    [selectedIndexes],
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
          {selectedIndexes.map((selectedIndex, index) => (
            <button
              type="button"
              key={selectedIndex}
              value={selectedIndex}
              className={cx(styles.button, {
                [styles.incorrect]:
                  selectableWords[selectedIndex] !== expectedWords[index],
                [styles.correct]:
                  selectableWords[selectedIndex] === expectedWords[index],
              })}
              onClick={unselectWord}
            >
              {selectableWords[selectedIndex]}
            </button>
          ))}
        </div>
        <hr />
        {selectableWords.map((word, index) => (
          <button
            type="button"
            disabled={selectedIndexes.includes(index)}
            key={index}
            value={index}
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
