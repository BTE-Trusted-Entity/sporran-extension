import type { Did } from '@kiltprotocol/types';

import { DidResolver } from '@kiltprotocol/sdk-js';

import { useAsyncValue } from '../useAsyncValue/useAsyncValue';

async function getIsOnChainDidDeleted(did: Did | undefined): Promise<boolean> {
  if (!did) {
    return false;
  }

  try {
    const { didResolutionMetadata, didDocumentMetadata } =
      await DidResolver.resolve(did, {});
    return Boolean(
      !didResolutionMetadata.error && didDocumentMetadata.deactivated,
    );
  } catch (error) {
    console.error(error, 'Could not get DID deletion status');
    return false;
  }
}

export function useIsOnChainDidDeleted(
  did: Did | undefined,
): boolean | undefined {
  return useAsyncValue(getIsOnChainDidDeleted, [did]);
}
