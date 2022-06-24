import { useMemo } from 'react';

import { useLocation } from 'react-router-dom';

import { base64ToJson } from '../base64/base64';

// To accommodate popups where navigation is possible, the data should only be returned once

export function usePopupData<Output>(): Output {
  const { search } = useLocation();

  return useMemo(() => {
    const params = new URLSearchParams(search);
    const data = params.get('data');
    if (!data) {
      throw new Error('Unable to parse search data');
    }
    return base64ToJson(data) as unknown as Output;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
