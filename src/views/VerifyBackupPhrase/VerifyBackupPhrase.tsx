import { JSX, useState, useCallback, MouseEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import cx from 'classnames';
import browser from 'webextension-polyfill';

import * as styles from './VerifyBackupPhrase.module.css';

import { LinkBack } from '../../components/LinkBack/LinkBack';
import { paths } from '../paths';

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
    (event: MouseEvent<HTMLButtonElement>) => {
      const selectedIndex = parseInt(event.currentTarget.value, 10);
      setSelectedIndexes([...selectedIndexes, selectedIndex]);
    },
    [selectedIndexes],
  );

  const unselectWord = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const unselectedIndex = parseInt(event.currentTarget.value, 10);
      setSelectedIndexes(
        selectedIndexes.filter((index) => index !== unselectedIndex),
      );
    },
    [selectedIndexes],
  );

  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      history.push(paths.identity.create.password);
    },
    [history],
  );

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>{t('view_VerifyBackupPhrase_heading')}</h1>
      <p className={styles.info}>{t('view_VerifyBackupPhrase_explanation')}</p>

      <form onSubmit={handleSubmit}>
        <div className={styles.selectedWords} id="selected-words">
          {selectedIndexes.map((selectedIndex, index) => {
            const correct =
              selectableWords[selectedIndex] === expectedWords[index];
            return (
              <button
                type="button"
                key={selectedIndex}
                value={selectedIndex}
                className={cx(styles.word, {
                  [styles.incorrect]: !correct,
                  [styles.correct]: correct,
                })}
                onClick={unselectWord}
              >
                {correct && (
                  <span className={styles.index}>
                    {(index + 1).toString().padStart(2, '0')}
                  </span>
                )}
                {selectableWords[selectedIndex]}
              </button>
            );
          })}
          <output
            htmlFor="selected-words"
            className={styles.tooltip}
            hidden={!error}
          >
            {error}
          </output>
        </div>

        <div className={styles.selectableWords}>
          {selectableWords.map((word, index) => (
            <button
              type="button"
              disabled={selectedIndexes.includes(index)}
              key={index}
              value={index}
              className={styles.word}
              onClick={selectWord}
            >
              {word}
            </button>
          ))}
        </div>

        <Link to={paths.home} className={styles.cancel}>
          {t('common_action_cancel')}
        </Link>
        <button
          type="submit"
          disabled={!allWordsSelected || Boolean(error)}
          className={styles.submit}
        >
          {t('common_action_next')}
        </button>
      </form>

      <LinkBack />
    </main>
  );
}
