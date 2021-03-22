import { browser } from 'webextension-polyfill-ts';

import styles from './ReceiveToken.module.css';

interface Props {
  account: {
    address: string;
    name: string;
  };
}

export function ReceiveToken({ account }: Props): JSX.Element {
  console.log('this is my account', account);
  const t = browser.i18n.getMessage;
  return (
    <section className={styles.container}>
      <h1>{t('view_ReceiveToken_heading')}</h1>
      <p>{t('view_ReceiveToken_explanation')}</p>
      <p>{t('view_ReceiveToken_account_address')}</p>
    </section>
  );
}
