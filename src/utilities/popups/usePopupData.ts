import { useMemo } from 'react';
import { AnyJson } from '@polkadot/types/types';

import { useQuery } from '../useQuery/useQuery';

export function jsonToBase64(object: AnyJson): string {
  return window.btoa(JSON.stringify(object));
}

export function base64ToJson(base64: string): AnyJson {
  return JSON.parse(window.atob(base64));
}

export function usePopupData<Output>(): Output {
  const { data } = useQuery();
  return useMemo(() => base64ToJson(data) as unknown as Output, [data]);
}
