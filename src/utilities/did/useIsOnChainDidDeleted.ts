import { DidUri } from '@kiltprotocol/types';
import { resolve } from '@kiltprotocol/did';

import { useAsyncValue } from '../useAsyncValue/useAsyncValue';

async function getIsOnChainDidDeleted(
  did: DidUri | undefined,
): Promise<boolean> {
  if (!did) {
    return false;
  }

  try {
    const resolved = await resolve(did);
    return Boolean(
      resolved && resolved.metadata && resolved.metadata.deactivated,
    );
  } catch (error) {
    console.error(error, 'Could not get DID deletion status');
    return false;
  }
}

export function useIsOnChainDidDeleted(
  did: DidUri | undefined,
): boolean | undefined {
  return useAsyncValue(getIsOnChainDidDeleted, [did]);
}
