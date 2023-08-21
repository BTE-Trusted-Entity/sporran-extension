import { MouseEvent, useCallback, useState } from 'react';
import { Modal } from 'react-dialog-polyfill';
import browser from 'webextension-polyfill';
import { without } from 'lodash-es';

import * as styles from './ImportCredentials.module.css';

import { Identity } from '../../utilities/identities/types';
import { IdentityLine } from '../../components/IdentityLine/IdentityLine';
import { Stats } from '../../components/Stats/Stats';

import { FailedImport, Import, SuccessfulImport } from './types';

interface Props {
  grouped: {
    identity: Identity;
    imports: SuccessfulImport[];
  }[];
  pending: Import[];
  failedImports: FailedImport[];
  setFailedImports: (values: FailedImport[]) => void;
  handleMoreClick: (event: MouseEvent) => void;
}

export function ImportCredentialsResults({
  grouped,
  pending,
  failedImports,
  setFailedImports,
  handleMoreClick,
}: Props) {
  const t = browser.i18n.getMessage;

  const [modalText, setModalText] = useState<string>();
  const onModalClose = useCallback(() => setModalText(undefined), []);

  const errors: Record<
    FailedImport['error'],
    { label: string; message: string }
  > = {
    orphaned: {
      label: t('view_ImportCredentials_unknownIdentityLabel'),
      message: t('view_ImportCredentials_unknownIdentityInfo'),
    },
    invalid: {
      label: t('view_ImportCredentials_wrongFormatLabel'),
      message: t('view_ImportCredentials_wrongFormatInfo'),
    },
    unexpected: {
      label: t('view_ImportCredentials_unexpectedErrorLabel'),
      message: t('view_ImportCredentials_unexpectedErrorInfo'),
    },
  };

  return (
    <section
      className={styles.container}
      onDragEnter={handleMoreClick}
      onDragOver={handleMoreClick}
      onDrop={handleMoreClick}
    >
      <h1 className={styles.heading}>{t('view_ImportCredentials_title')}</h1>
      <p className={styles.subline}>{t('view_ImportCredentials_subline')}</p>

      <div className={styles.workspace}>
        {pending.length > 0 && (
          <ul className={styles.imports}>
            {pending.map((fileImport, index) => (
              <li key={`${index}${fileImport}`} className={styles.fileImport}>
                <h4 className={styles.fileName} title={fileImport.fileName}>
                  {fileImport.fileName}
                </h4>
                <p className={styles.fileResult}>
                  {t('view_ImportCredentials_pendingImport')}
                </p>
              </li>
            ))}
          </ul>
        )}

        {failedImports.length > 0 && (
          <ul className={styles.imports}>
            {failedImports.map((fileImport, index) => {
              const error = errors[fileImport.error] || errors.unexpected;
              return (
                <li
                  key={`${index}${fileImport}`}
                  className={styles.failedImport}
                >
                  <h4 className={styles.fileName} title={fileImport.fileName}>
                    {fileImport.fileName}
                  </h4>
                  <button
                    className={styles.fileHide}
                    type="button"
                    aria-label={t('view_ImportCredentials_hideError')}
                    title={t('view_ImportCredentials_hideError')}
                    onClick={() =>
                      setFailedImports(without(failedImports, fileImport))
                    }
                  />
                  <button
                    className={styles.fileResultFail}
                    type="button"
                    onClick={() => setModalText(error.message)}
                  >
                    {error.label}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {modalText && (
          <Modal open className={styles.overlay}>
            <p className={styles.overlayText}>{modalText}</p>
            <button
              type="button"
              className={styles.overlayClose}
              onClick={onModalClose}
            >
              {t('common_action_close')}
            </button>
          </Modal>
        )}

        {grouped && grouped.length > 0 && (
          <ul className={styles.imports}>
            {grouped.map(({ identity, imports }) => (
              <li key={identity.address}>
                <IdentityLine identity={identity} />

                <ul className={styles.imports}>
                  {imports.map((fileImport, index) => (
                    <li
                      key={`${index}${fileImport}`}
                      className={styles.successfulImport}
                    >
                      <h4
                        className={styles.successfulFileName}
                        title={fileImport.fileName}
                      >
                        {fileImport.fileName}
                      </h4>
                      <p className={styles.fileResult}>
                        {t('view_ImportCredentials_successfulImport')}
                      </p>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}

        <button className={styles.more} onClick={handleMoreClick} type="button">
          {t('view_ImportCredentials_more')}
        </button>

        <button className={styles.home} onClick={window.close} type="button">
          {t('common_action_close')}
        </button>
      </div>

      <Stats />
    </section>
  );
}
