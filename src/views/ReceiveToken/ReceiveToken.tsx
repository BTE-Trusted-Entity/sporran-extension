import { useCallback, useRef, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { useRouteMatch } from 'react-router-dom';
import { Modal } from 'react-dialog-polyfill';

import { Account, isNew } from '../../utilities/accounts/accounts';
import { AccountOverviewNew } from '../AccountOverview/AccountOverviewNew';
import { AccountsCarousel } from '../../components/AccountsCarousel/AccountsCarousel';
import { QRCode } from '../../components/QRCode/QRCode';
import { Stats } from '../../components/Stats/Stats';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { useCopyButton } from '../../components/useCopyButton/useCopyButton';

import styles from './ReceiveToken.module.css';

interface Props {
  account: Account;
}

export function ReceiveToken({ account }: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  const { path } = useRouteMatch();
  const addressRef = useRef<HTMLInputElement>(null);
  const copy = useCopyButton(addressRef);

  const [largeQR, setLargeQR] = useState(false);

  const handleEnlargeClick = useCallback(() => {
    setLargeQR(true);
  }, []);

  const handleCloseClick = useCallback(() => {
    setLargeQR(false);
  }, []);

  if (isNew(account)) {
    return <AccountOverviewNew />;
  }

  const { address } = account;

  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>{t('view_ReceiveToken_heading')}</h1>
      <p className={styles.subline}>{t('view_ReceiveToken_explanation')}</p>

      <AccountsCarousel path={path} account={account} hasNoDropdown={true} />

      <small id="addressLabel" className={styles.small}>
        {t('view_ReceiveToken_account_address')}
      </small>
      <p className={styles.addressLine}>
        <input
          className={styles.address}
          ref={addressRef}
          readOnly
          value={address}
          aria-labelledby="addressLabel"
        />
        {copy.supported && (
          <button
            className={copy.className}
            onClick={copy.handleCopyClick}
            type="button"
            aria-label={copy.title}
            title={copy.title}
          />
        )}
      </p>

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
