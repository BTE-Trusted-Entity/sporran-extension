import { browser } from 'webextension-polyfill-ts';

export function CreateAccountSuccess(): JSX.Element {
  const t = browser.i18n.getMessage;
  return (
    <main>
      <h1>{t('view_CreateAccountSuccess_heading')}</h1>
      <p>{t('view_CreateAccountSuccess_message')}</p>
    </main>
  );
}
