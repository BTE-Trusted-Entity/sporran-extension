import { useCallback, useRef, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { generatePath, Link, useRouteMatch } from 'react-router-dom';

import { Account, isNew } from '../../utilities/accounts/accounts';
import { AccountOverviewNew } from '../AccountOverview/AccountOverviewNew';
import { AccountsCarousel } from '../../components/AccountsCarousel/AccountsCarousel';
import { QRCode } from '../../components/QRCode/QRCode';
import { Stats } from '../../components/Stats/Stats';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { paths } from '../paths';

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

  if (isNew(account)) {
    return <AccountOverviewNew />;
  }

  return (
    <section className={styles.container}>
      <h1>{t('view_ReceiveToken_heading')}</h1>
      <p>{t('view_ReceiveToken_explanation')}</p>

      <AccountsCarousel path={path} account={account} />

      <p>{t('view_ReceiveToken_account_address')}</p>
      <div className={styles.accountBox}>
        <input
          className={styles.addressBox}
          ref={addressRef}
          readOnly
          value={address}
        />
        <p>{isCopied ? '✔' : '⊛'}</p>
      </div>

      {document.queryCommandSupported('copy') && (
        <button onClick={copyToClipboard} type="button">
          {t('view_ReceiveToken_copy_button')}
        </button>
      )}

      <button
        className={styles.qrCodeToggle}
        type="button"
        onClick={handleEnlargeClick}
        aria-label={t('view_ReceiveToken_enlarge')}
      >
        <QRCode address={address} className={styles.qrCode} />
        <span className={styles.qrCodeShadow} />
      </button>

      <p>
        <Link to={generatePath(paths.account.overview, { address })}>
          {t('view_ReceiveToken_done_button')}
        </Link>
      </p>

      <LinkBack />

      <Stats />
    </section>
  );
}
