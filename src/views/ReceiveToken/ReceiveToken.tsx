import { useCallback, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { Modal } from 'react-dialog-polyfill';

import { Identity, isNew } from '../../utilities/identities/identities';
import { IdentityOverviewNew } from '../IdentityOverview/IdentityOverviewNew';
import { IdentitiesCarousel } from '../../components/IdentitiesCarousel/IdentitiesCarousel';
import { QRCode } from '../../components/QRCode/QRCode';
import { Stats } from '../../components/Stats/Stats';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { CopyValue } from '../../components/CopyValue/CopyValue';

import * as styles from './ReceiveToken.module.css';

interface Props {
  identity: Identity;
}

export function ReceiveToken({ identity }: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  const [largeQR, setLargeQR] = useState(false);

  const handleEnlargeClick = useCallback(() => {
    setLargeQR(true);
  }, []);

  const handleCloseClick = useCallback(() => {
    setLargeQR(false);
  }, []);

  if (isNew(identity)) {
    return <IdentityOverviewNew />;
  }

  const { address } = identity;

  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>{t('view_ReceiveToken_heading')}</h1>
      <p className={styles.subline}>{t('view_ReceiveToken_explanation')}</p>

      <IdentitiesCarousel identity={identity} options={false} />

      <small id="addressLabel" className={styles.small}>
        {t('view_ReceiveToken_identity_address')}
      </small>

      <CopyValue
        value={address}
        labelledBy="addressLabel"
        className={styles.addressLine}
      />

      <button
        className={styles.qrCodeToggle}
        type="button"
        onClick={handleEnlargeClick}
        aria-label={t('view_ReceiveToken_enlarge')}
      >
        <QRCode address={address} className={styles.qrCode} />
        <span className={styles.qrCodeShadow} />
      </button>

      <Modal open={largeQR} className={styles.dialog}>
        <QRCode address={address} className={styles.qrCodeLarge} />
        <button
          type="button"
          onClick={handleCloseClick}
          className={styles.dialogClose}
          aria-label={t('common_action_close')}
        />
      </Modal>

      <LinkBack />

      <Stats />
    </section>
  );
}
