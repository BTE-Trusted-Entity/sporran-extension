import { browser } from 'webextension-polyfill-ts';
import { useEffect, useState } from 'react';

import { getNextTartan } from '../../utilities/accounts/tartans';
import { Avatar } from '../Avatar/Avatar';

import styles from './AccountSlide.module.css';

export function AccountSlideNew(): JSX.Element {
  const t = browser.i18n.getMessage;

  const [nextTartan, setNextTartan] = useState('');

  useEffect(() => {
    (async () => {
      setNextTartan(await getNextTartan());
    })();
  }, []);

  return (
    <section>
      <Avatar tartan={nextTartan} />
      <p className={styles.new}>{t('component_AccountSlideNew_title')}</p>
    </section>
  );
}
