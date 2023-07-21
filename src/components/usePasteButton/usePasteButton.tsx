import { MouseEventHandler, RefObject, useCallback } from 'react';
import browser from 'webextension-polyfill';

import * as styles from './usePasteButton.module.css';

interface UsePasteButton {
  supported: boolean;
  handlePasteClick: MouseEventHandler;
  className: string;
  title: string;
}

export function usePasteButton(
  inputRef: RefObject<HTMLInputElement>,
  onPaste: (value: string) => void,
): UsePasteButton {
  const t = browser.i18n.getMessage;
  const title = t('component_usePasteButton_paste');

  const supported = navigator.clipboard && 'readText' in navigator.clipboard;

  const className = styles.paste;

  const handlePasteClick = useCallback(async () => {
    const input = inputRef.current;
    if (!input || !supported) {
      return;
    }

    // Chrome doesn’t support the new API in extensions, so go with old-school way first
    try {
      input.select();
      document.execCommand('paste');
    } catch {
      input.value = await navigator.clipboard.readText();
    }

    onPaste(input.value);
  }, [inputRef, supported, onPaste]);

  return {
    supported,
    handlePasteClick,
    className,
    title,
  };
}
