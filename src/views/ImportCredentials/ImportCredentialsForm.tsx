import { ChangeEvent, DragEvent, useCallback } from 'react';
import browser from 'webextension-polyfill';

import * as styles from './ImportCredentials.module.css';

interface Props {
  handleFiles: (files: FileList) => void;
}

export function ImportCredentialsForm({ handleFiles }: Props) {
  const t = browser.i18n.getMessage;

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const input = event.target;
      if (input.files) {
        handleFiles(input.files);
      }
    },
    [handleFiles],
  );

  const handleDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      event.stopPropagation();

      handleFiles(event.dataTransfer.files);
    },
    [handleFiles],
  );

  const handleDrag = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  return (
    <section
      className={styles.container}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <h1 className={styles.heading}>{t('view_ImportCredentials_title')}</h1>
      <p className={styles.subline}>{t('view_ImportCredentials_subline')}</p>

      <div className={styles.workspace}>
        <form className={styles.form}>
          <p className={styles.drop}>{t('view_ImportCredentials_drop')}</p>

          <p>
            <label className={styles.fileLabel}>
              {t('view_ImportCredentials_cta')}
              <input
                type="file"
                className={styles.file}
                onChange={handleChange}
                name="credentials"
                multiple
                accept=".json,text/json"
              />
            </label>
          </p>

          <button
            className={styles.cancel}
            onClick={window.close}
            type="button"
          >
            {t('common_action_cancel')}
          </button>
        </form>
      </div>
    </section>
  );
}
