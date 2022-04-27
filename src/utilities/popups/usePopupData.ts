import { useMemo } from 'react';

import { useQuery } from '../useQuery/useQuery';
import { base64ToJson } from '../base64/base64';

export function usePopupData<Output>(): Output {
  const { data } = useQuery();
  return useMemo(() => base64ToJson(data) as unknown as Output, [data]);
}
