import { useCallback, useRef, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { generatePath, Link, useRouteMatch } from 'react-router-dom';

import { Account, AccountsMap } from '../../utilities/accounts/accounts';
import { AccountsCarousel } from '../../components/AccountsCarousel/AccountsCarousel';
import { paths } from '../paths';

import styles from './ReceiveToken.module.css';

interface Props {
  account: Account;
  accounts: AccountsMap;
}

export function ReceiveToken({ account, accounts }: Props): JSX.Element {
  const addressRef = useRef<HTMLInputElement>(null);
  const [isCopied, setIsCopied] = useState(false);
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

  return (
    <section className={styles.container}>
      <h1>{t('view_ReceiveToken_heading')}</h1>
      <p>{t('view_ReceiveToken_explanation')}</p>

      <AccountsCarousel path={path} account={account} accounts={accounts} />

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

      <p>[Insert QR Image] </p>
      <p>
        <Link to={generatePath(paths.account.overview, { address })}>
          {t('view_ReceiveToken_done_button')}
        </Link>
      </p>
      <p>
        <Link to={generatePath(paths.account.overview, { address })}>
          {t('common_action_back')}
        </Link>
      </p>
      <p>10 account - Total balance: 1000.0000 K</p>
    </section>
  );
}
