import type { HexString } from '@polkadot/util/types';

import { JSX } from 'react';
import { browser } from 'webextension-polyfill-ts';

import * as styles from './UnknownCredential.module.css';

export function UnknownCredential({
  rootHash,
}: {
  rootHash: HexString;
}): JSX.Element {
  const t = browser.i18n.getMessage;
  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>
        {t('component_UnknownCredential_heading')}
      </h1>
      <p className={styles.text}>
        {t('component_UnknownCredential_text', [rootHash])}
      </p>
      <p className={styles.text}>{t('component_UnknownCredential_info')}</p>
    </section>
  );
}
