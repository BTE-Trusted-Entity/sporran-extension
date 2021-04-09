import { browser } from 'webextension-polyfill-ts';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { paths } from '../../views/paths';
import { storage } from '../../utilities/accounts/storage';
import { NEXT_TARTAN } from '../../utilities/accounts/tartans';

export function AccountSlideNew(): JSX.Element {
  const t = browser.i18n.getMessage;

  const [nextTartan, setNextTartan] = useState('');

  useEffect(() => {
    (async function getNextTartan() {
      const tartan = (await storage.get(NEXT_TARTAN))[NEXT_TARTAN] as string;
      setNextTartan(tartan);
    })();
  }, []);

  return (
    <section>
      <h3>{nextTartan}</h3>
      <Link to={paths.account.create.start}>
        <h2>{t('component_AccountSlideNew_title')}</h2>
      </Link>
      <p>{t('component_AccountSlideNew_or')}</p>
      <Link to={paths.account.import.start}>
        {t('component_AccountSlideNew_import')}
      </Link>
    </section>
  );
}
