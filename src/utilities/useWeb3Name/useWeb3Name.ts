import type { Did } from '@kiltprotocol/types';

import { ConfigService } from '@kiltprotocol/sdk-js';
import { linkedInfoFromChain, toChain } from '@kiltprotocol/did';

import { isFullDid } from '../did/did';
import { useAsyncValue } from '../useAsyncValue/useAsyncValue';

export function useWeb3Name(did: Did | undefined): string | null | undefined {
  return useAsyncValue(
    async (did) => {
      if (!(did && isFullDid(did))) {
        return null;
      }

      const api = ConfigService.get('api');
      const result = await api.call.did.query(toChain(did));
      if (result.isNone) {
        return null;
      }

      return linkedInfoFromChain(result).document.alsoKnownAs?.[0];
    },
    [did],
  );
}
