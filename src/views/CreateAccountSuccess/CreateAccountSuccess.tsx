import { browser } from 'webextension-polyfill-ts';
import { Link } from 'react-router-dom';

import { paths, generatePath } from '../paths';

interface Props {
  type?: 'create' | 'import' | 'reset';
  address: string;
}

export function CreateAccountSuccess({
  type = 'create',
  address,
}: Props): JSX.Element {
  const t = browser.i18n.getMessage;
  return (
    <main>
      <h1>{t('view_CreateAccountSuccess_heading')}</h1>

      <p>
        {type === 'create' && t('view_CreateAccountSuccess_message_create')}
        {type === 'import' && t('view_CreateAccountSuccess_message_import')}
        {type === 'reset' && t('view_CreateAccountSuccess_message_reset')}
      </p>

      <Link to={generatePath(paths.account.overview, { address })}>
        {t('view_CreateAccountSuccess_CTA')}
      </Link>
    </main>
  );
}
