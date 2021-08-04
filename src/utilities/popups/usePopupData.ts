import { useMemo } from 'react';
import type { AnyJson } from '@polkadot/types/types';

import { useQuery } from '../useQuery/useQuery';

export function jsonToBase64(object: Partial<AnyJson>): string {
  return window.btoa(JSON.stringify(object));
}

export function base64ToJson<Output>(base64: string): Output {
  return JSON.parse(window.atob(base64));
}

export function usePopupData<Output>(): Output {
  const { data } = useQuery();
  return useMemo(() => {
    return base64ToJson<Output>(data);
  }, [data]);
}
