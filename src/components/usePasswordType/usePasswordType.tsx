import { useCallback, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';

import * as styles from './usePasswordType.module.css';

interface usePasswordTypeType {
  passwordType: 'password' | 'text';
  passwordToggle: JSX.Element;
}

export function usePasswordType(initiallyVisible = false): usePasswordTypeType {
  const t = browser.i18n.getMessage;
  const [visible, setVisible] = useState(initiallyVisible);

  const handleHideClick = useCallback(() => {
    setVisible(false);
  }, []);

  const handleShowClick = useCallback(() => {
    setVisible(true);
  }, []);

  const passwordType = visible ? 'text' : 'password';

  const passwordToggle = visible ? (
    <button
      type="button"
      onClick={handleHideClick}
      className={styles.hide}
      title={t('component_usePasswordType_hide')}
      aria-label={t('component_usePasswordType_hide')}
    />
  ) : (
    <button
      type="button"
      onClick={handleShowClick}
      className={styles.show}
      title={t('component_usePasswordType_show')}
      aria-label={t('component_usePasswordType_show')}
    />
  );

  return { passwordType, passwordToggle };
}
