import browser from 'webextension-polyfill';
import { JSX } from 'react';
import { Link } from 'react-router-dom';

import * as styles from './IdentitySlide.module.css';

import { paths } from '../../views/paths';

export function IdentitySlideNew(): JSX.Element {
  const t = browser.i18n.getMessage;

  return (
    <section>
      <Link
        to={paths.identity.add}
        className={styles.add}
        aria-label={t('component_IdentitySlideNew_title')}
        title={t('component_IdentitySlideNew_title')}
      />
    </section>
  );
}
