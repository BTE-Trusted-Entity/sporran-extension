import { Fragment, PropsWithChildren, RefObject } from 'react';
import { createPortal } from 'react-dom';
import { Modal } from 'react-dialog-polyfill';
import browser from 'webextension-polyfill';

import * as styles from './ExplainerModal.module.css';

import { useBooleanState } from '../../utilities/useBooleanState/useBooleanState';

export function ExplainerModal({
  children,
  portalRef,
  label = browser.i18n.getMessage('component_ExplainerModal_show'),
}: PropsWithChildren<{
  portalRef: RefObject<HTMLElement>;
  label?: string;
}>) {
  const t = browser.i18n.getMessage;
  const visibility = useBooleanState();

  return (
    <Fragment>
      <button
        type="button"
        className={styles.show}
        onClick={visibility.on}
        aria-label={label}
      />

      {visibility.current &&
        portalRef.current &&
        createPortal(
          <Modal open className={styles.overlay}>
            <p className={styles.info}>{children}</p>

            <button
              type="button"
              className={styles.close}
              onClick={visibility.off}
            >
              {t('common_action_close')}
            </button>
          </Modal>,
          portalRef.current,
        )}
    </Fragment>
  );
}
