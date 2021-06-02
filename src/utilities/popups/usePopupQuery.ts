import { useMemo } from 'react';

import { useQuery } from '../useQuery/useQuery';

export function makeUsePopupQuery<
  Input,
  JsonInput extends Record<string, string>,
>(jsonToInput: (input: JsonInput) => Input): () => Input {
  return function usePopupQuery(): Input {
    const query = useQuery() as JsonInput;
    return useMemo(() => jsonToInput(query), [query]);
  };
}
