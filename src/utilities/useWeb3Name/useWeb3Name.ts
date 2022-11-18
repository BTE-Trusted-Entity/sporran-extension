import { Web3Names } from '@kiltprotocol/did';
import { DidUri } from '@kiltprotocol/types';

import { isFullDid } from '../did/did';
import { useAsyncValue } from '../useAsyncValue/useAsyncValue';

export function useWeb3Name(
  did: DidUri | undefined,
): string | null | undefined {
  return useAsyncValue(
    async (did) =>
      did && isFullDid(did) ? Web3Names.queryWeb3NameForDid(did) : null,
    [did],
  );
}
