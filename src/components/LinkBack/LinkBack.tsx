import { useNavigate } from 'react-router-dom';
import { browser } from 'webextension-polyfill-ts';

import * as styles from './LinkBack.module.css';
import { useCallback } from 'react';

export function LinkBack(): JSX.Element {
  const t = browser.i18n.getMessage;
  const navigate = useNavigate();
  const goBack = useCallback(() => navigate(-1), [navigate]);

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
