import { browser } from 'webextension-polyfill-ts';
import { generatePath, Link } from 'react-router-dom';

import styles from './ReceiveToken.module.css';
import { paths } from '../paths';
import { useRef, useState } from 'react';

interface Props {
  account: {
    address: string;
    name: string;
  };
}

export function ReceiveToken({ account }: Props): JSX.Element {
  const addressRef = useRef(null);
  const [copySymbol, setCopySymbol] = useState(false);
  const { address, name } = account;
  const t = browser.i18n.getMessage;

  function copyToClipboard(): void {
    setCopySymbol(true);
    addressRef.current.select();
    document.execCommand('copy');
    setTimeout(function () {
      setCopySymbol(false);
    }, 500);
  }

  return (
    <section className={styles.container}>
      <h1>{t('view_ReceiveToken_heading')}</h1>
      <p>{t('view_ReceiveToken_explanation')}</p>
      <label>
        {t('view_ReceiveToken_name')} {name}
      </label>

      <p>[Insert account Image] </p>
      <p>[Insert switch buttons]</p>
      <p>{t('view_ReceiveToken_account_address')}</p>
      <div className={styles.accountBox}>
        {document.queryCommandSupported('copy') && (
          <input
            className={styles.addressBox}
            ref={addressRef}
            readOnly
            value={address}
          />
        )}
        <p>{copySymbol ? '✔' : '⊛'}</p>
      </div>
      <button onClick={copyToClipboard}>
        {t('view_ReceiveToken_copy_button')}
      </button>
      <p>[Insert QR Image] </p>
      <p>[Insert number of accounts] </p>

      <button>
        <Link to={generatePath(paths.account.overview, { address })}>
          {t('view_ReceiveToken_done_button')}
        </Link>
      </button>

      <p>
        <Link to={generatePath(paths.account.overview, { address })}>
          {t('common_action_back')}
        </Link>
      </p>
      <p>10 account - Total balance: 1000.0000 K</p>
    </section>
  );
}
