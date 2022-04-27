import { IDidDetails } from '@kiltprotocol/types';
import { DidResolver } from '@kiltprotocol/did';

import { useAsyncValue } from '../useAsyncValue/useAsyncValue';

async function getIsOnChainDidDeleted(
  did: IDidDetails['did'],
): Promise<boolean> {
  if (!did) {
    return false;
  }

  try {
    const resolved = await DidResolver.resolveDoc(did);
    return Boolean(
      resolved && resolved.metadata && resolved.metadata.deactivated,
    );
  } catch (error) {
    console.error(error, 'Could not get DID deletion status');
    return false;
  }
}

export function useIsOnChainDidDeleted(
  did: IDidDetails['did'],
): boolean | undefined {
  return useAsyncValue(getIsOnChainDidDeleted, [did]);
}
