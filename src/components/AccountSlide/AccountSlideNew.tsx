import { browser } from 'webextension-polyfill-ts';
import { Link } from 'react-router-dom';

import { paths } from '../../views/paths';
import { Avatar } from '../Avatar/Avatar';

import styles from './AccountSlide.module.css';

interface Props {
  nextTartan: string;
}

export function AccountSlideNew({ nextTartan }: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  return (
    <section>
      <Avatar tartan={nextTartan} />
      <p className={styles.new}>{t('component_AccountSlideNew_title')}</p>

      <Link to={paths.account.import.start} className={styles.import}>
        {t('component_AccountSlideNew_import')}
      </Link>
    </section>
  );
}
