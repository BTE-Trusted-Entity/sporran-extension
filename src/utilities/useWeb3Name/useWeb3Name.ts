import { Web3Names } from '@kiltprotocol/did';

import { isFullDid } from '../did/did';
import { useAsyncValue } from '../useAsyncValue/useAsyncValue';

export function useWeb3Name(did: string): string | null | undefined {
  return useAsyncValue(
    async (did) => (isFullDid(did) ? Web3Names.queryWeb3NameForDid(did) : null),
    [did],
  );
}
