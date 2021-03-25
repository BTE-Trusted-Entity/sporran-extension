import { browser } from 'webextension-polyfill-ts';
import { Link } from 'react-router-dom';

import { paths } from '../../views/paths';

export function AccountSlideNew(): JSX.Element {
  const t = browser.i18n.getMessage;

  return (
    <section>
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
