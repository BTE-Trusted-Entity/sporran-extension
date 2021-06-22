import { browser } from 'webextension-polyfill-ts';
import { Link } from 'react-router-dom';

import { paths } from '../../views/paths';

import styles from './AccountSlide.module.css';

export function AccountSlideNew(): JSX.Element {
  const t = browser.i18n.getMessage;

  return (
    <section>
      <Link
        to={paths.account.create.start}
        className={styles.create}
        aria-label={t('component_AccountSlideNew_title')}
        title={t('component_AccountSlideNew_title')}
      />
      <p className={styles.new}>{t('component_AccountSlideNew_title')}</p>
    </section>
  );
}
