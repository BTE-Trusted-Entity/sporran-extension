import { useHistory } from 'react-router-dom';
import { browser } from 'webextension-polyfill-ts';

import * as styles from './LinkBack.module.css';

export function LinkBack(): JSX.Element {
  const t = browser.i18n.getMessage;
  const { goBack } = useHistory();

  return (
    <button
      type="button"
      title={t('common_action_back')}
      aria-label={t('common_action_back')}
      onClick={goBack}
      className={styles.linkBack}
    />
  );
}
