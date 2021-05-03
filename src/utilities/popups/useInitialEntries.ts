import { paths } from '../../views/paths';
import { PopupAction } from './types';
import { useMemo } from 'react';

function isExtensionPopup() {
  return !new URLSearchParams(window.location.search).has('action');
}

/** Transforms the URI of externally opened popup into internal URI */
export function useInitialEntries(): string[] | undefined {
  return useMemo(() => {
    if (isExtensionPopup()) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const action = params.get('action');
    if (!action || !(action in paths.popup)) {
      console.log(new Error(`Invalid popup action: ${action}`));
      window.close();
      return;
    }

    const path = paths.popup[action as PopupAction];

    params.delete('action');

    const internalUri = `${path}?${params.toString()}`;
    return [internalUri];
  }, []);
}
