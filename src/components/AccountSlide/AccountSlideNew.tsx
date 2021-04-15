import { browser } from 'webextension-polyfill-ts';
import { Link } from 'react-router-dom';

import { paths } from '../../views/paths';
import { Avatar } from '../Avatar/Avatar';

import styles from './AccountSlide.module.css';
import { useState, useEffect } from 'react';
import { getNextTartan } from '../../utilities/accounts/tartans';

export function AccountSlideNew(): JSX.Element {
  const t = browser.i18n.getMessage;

  const [nextTartan, setNextTartan] = useState('');

  useEffect(() => {
    (async () => setNextTartan(await getNextTartan()))();
  }, []);

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
