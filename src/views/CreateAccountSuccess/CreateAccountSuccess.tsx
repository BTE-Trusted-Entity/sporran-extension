import { browser } from 'webextension-polyfill-ts';
import { Link } from 'react-router-dom';

interface Props {
  type?: 'create' | 'import';
}

export function CreateAccountSuccess({ type = 'create' }: Props): JSX.Element {
  const t = browser.i18n.getMessage;
  return (
    <main>
      <h1>{t('view_CreateAccountSuccess_heading')}</h1>

      <p>
        {type === 'create' && t('view_CreateAccountSuccess_message_create')}
        {type === 'import' && t('view_CreateAccountSuccess_message_import')}
      </p>

      <Link to="/">{t('view_CreateAccountSuccess_CTA')}</Link>
    </main>
  );
}
