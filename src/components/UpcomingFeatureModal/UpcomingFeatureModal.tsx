import { browser } from 'webextension-polyfill-ts';
import { Modal } from 'react-dialog-polyfill';

import styles from './UpcomingFeatureModal.module.css';

interface Props {
  onClose: () => void;
}

export function UpcomingFeatureModal({ onClose }: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  return (
    <Modal open className={styles.container}>
      <p className={styles.info}>{t('component_UpcomingFeatureModal_info')}</p>
      <button className={styles.close} onClick={onClose}>
        {t('common_action_close')}
      </button>
    </Modal>
  );
}
