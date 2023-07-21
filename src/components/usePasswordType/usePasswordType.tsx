import { JSX } from 'react';
import browser from 'webextension-polyfill';

import * as styles from './usePasswordType.module.css';

import { useBooleanState } from '../../utilities/useBooleanState/useBooleanState';

interface usePasswordTypeType {
  passwordType: 'password' | 'text';
  passwordToggle: JSX.Element;
}

export function usePasswordType(initiallyVisible = false): usePasswordTypeType {
  const t = browser.i18n.getMessage;
  const visible = useBooleanState(initiallyVisible);

  const passwordType = visible.current ? 'text' : 'password';

  const passwordToggle = visible.current ? (
    <button
      type="button"
      onClick={visible.off}
      className={styles.hide}
      title={t('component_usePasswordType_hide')}
      aria-label={t('component_usePasswordType_hide')}
    />
  ) : (
    <button
      type="button"
      onClick={visible.on}
      className={styles.show}
      title={t('component_usePasswordType_show')}
      aria-label={t('component_usePasswordType_show')}
    />
  );

  return { passwordType, passwordToggle };
}
