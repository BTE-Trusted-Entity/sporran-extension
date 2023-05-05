import type { KiltAddress } from '@kiltprotocol/sdk-js';

import { browser } from 'webextension-polyfill-ts';

import * as styles from './UnknownIdentity.module.css';

export function UnknownIdentity({
  address,
}: {
  address: KiltAddress;
}): JSX.Element {
  const t = browser.i18n.getMessage;
  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>
        {t('component_UnknownIdentity_heading')}
      </h1>
      <p className={styles.text}>
        {t('component_UnknownIdentity_text', [address])}
      </p>
      <p className={styles.text}>{t('component_UnknownIdentity_info')}</p>
    </section>
  );
}
