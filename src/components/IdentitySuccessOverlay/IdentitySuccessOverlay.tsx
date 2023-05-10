import { browser } from 'webextension-polyfill-ts';
import { JSX } from 'react';
import { Modal } from 'react-dialog-polyfill';

import * as styles from './IdentitySuccessOverlay.module.css';

import { Avatar } from '../Avatar/Avatar';
import { Identity } from '../../utilities/identities/identities';

interface Props {
  identity: Identity;
  successType: 'created' | 'imported' | 'pwreset';
  onSuccessOverlayButtonClick: () => void;
}

export function IdentitySuccessOverlay({
  identity,
  successType,
  onSuccessOverlayButtonClick,
}: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  const messages = {
    created: t('component_IdentitySuccessOverlay_message_create'),
    imported: t('component_IdentitySuccessOverlay_message_import'),
    pwreset: t('component_IdentitySuccessOverlay_message_reset'),
  };

  return (
    <Modal open className={styles.overlay}>
      <Avatar identity={identity} />
      <h1 className={styles.heading}>
        {t('component_IdentitySuccessOverlay_heading')}
      </h1>
      <p className={styles.text}>{messages[successType]}</p>
      <button
        type="button"
        className={styles.button}
        onClick={onSuccessOverlayButtonClick}
      >
        {t('component_IdentitySuccessOverlay_button')}
      </button>
    </Modal>
  );
}
