import { ConfigService } from '@kiltprotocol/config';
import * as Did from '@kiltprotocol/did';
import { DidUri } from '@kiltprotocol/types';

import { isFullDid } from '../did/did';
import { useAsyncValue } from '../useAsyncValue/useAsyncValue';

export function useWeb3Name(
  did: DidUri | undefined,
): string | null | undefined {
  return useAsyncValue(
    async (did) => {
      if (!(did && isFullDid(did))) {
        return null;
      }

      const api = ConfigService.get('api');
      const result = await api.call.did.query(Did.toChain(did));
      if (result.isNone) {
        return null;
      }

      return Did.linkedInfoFromChain(result).web3Name;
    },
    [did],
  );
}
