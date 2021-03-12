import { browser } from 'webextension-polyfill-ts';

import styles from './Warning.module.css';

export function Warning(): JSX.Element {
  const t = browser.i18n.getMessage;

  function NextView() {
    // TODO: Navigate to SaveBackupPhrase
  }
  function PreviousView(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    // TODO: Navigate to Welcome
  }

  return (
    <div className={styles.container}>
      <a
        href="#"
        className={styles.backButton}
        onClick={(e) => PreviousView(e)}
      >
        {t('common_action_back')}
      </a>
      <h1>{t('view_Warning_headline')}</h1>
      <div>
        <h3>[Insert logo here]</h3>
      </div>
      <h2>{t('view_Warning_emphasis')}</h2>
      <p>{t('view_Warning_explanation')}</p>
      <h2>{t('view_Warning_emphasis_again')}</h2>
      <button onClick={NextView}>{t('view_Warning_CTA')}</button>
      {/* TODO: Navigate back to Welcome page */}
      <a href="#" onClick={(e) => PreviousView(e)}>
        {t('common_action_cancel')}
      </a>
    </div>
  );
}
