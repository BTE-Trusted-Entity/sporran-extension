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

import styles from './ReceiveToken.module.css';

interface Props {
  account: Account;
}

export function ReceiveToken({ account }: Props): JSX.Element {
  const addressRef = useRef<HTMLInputElement>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [largeQR, setLargeQR] = useState(false);
  const { path } = useRouteMatch();

  const { address } = account;
  const t = browser.i18n.getMessage;

  const copyToClipboard = useCallback(() => {
    addressRef?.current?.select?.();
    document.execCommand('copy');
    setIsCopied(true);
    setTimeout(function () {
      setIsCopied(false);
    }, 500);
  }, [addressRef]);

  const handleEnlargeClick = useCallback(() => {
    setLargeQR(true);
  }, []);
  const handleCloseClick = useCallback(() => {
    setLargeQR(false);
  }, []);

  if (isNew(account)) {
    return <AccountOverviewNew />;
  }

  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>{t('view_ReceiveToken_heading')}</h1>
      <p className={styles.subline}>{t('view_ReceiveToken_explanation')}</p>

      <AccountsCarousel path={path} account={account} />

      <small className={styles.small}>
        {t('view_ReceiveToken_account_address')}
      </small>
      <div className={styles.addressWrapper}>
        <input
          className={styles.addressBox}
          ref={addressRef}
          readOnly
          value={address}
        />
        {isCopied ? (
          <span className={styles.copied} />
        ) : (
          document.queryCommandSupported('copy') && (
            <button
              className={styles.copy}
              onClick={copyToClipboard}
              type="button"
              aria-label={t('view_ReceiveToken_copy_button')}
              title={t('view_ReceiveToken_copy_button')}
            />
          )
        )}
      </div>

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
