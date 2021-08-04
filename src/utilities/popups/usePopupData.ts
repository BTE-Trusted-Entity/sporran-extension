import { useMemo } from 'react';
import { ITerms, IClaim } from '@kiltprotocol/types';

import { useQuery } from '../useQuery/useQuery';

type Terms = ITerms & { claim: IClaim; attester: string };

export function usePopupData(): Terms {
  const { data } = useQuery();
  return useMemo(() => {
    return JSON.parse(window.atob(data));
  }, [data]);
}
