import { useMemo } from 'react';
import {
  SignerPayloadJSON,
  SignerResult,
} from '@polkadot/types/types/extrinsic';

import {
  getPopupResult,
  sendPopupResponse,
} from '../../connection/PopupMessages/PopupMessages';
import { useQuery } from '../../utilities/useQuery/useQuery';

export async function getSignPopupResult(
  payload: SignerPayloadJSON,
): Promise<SignerResult> {
  const { id, signature } = await getPopupResult('sign', {
    ...payload,
    version: String(payload.version),
    signedExtensions: JSON.stringify(payload.signedExtensions),
  });

  return {
    id: parseInt(id),
    signature,
  };
}

export function useSignPopupQuery(): SignerPayloadJSON {
  const query = useQuery();
  return useMemo(
    () =>
      ({
        ...query,
        version: parseInt(query.version),
        signedExtensions: JSON.parse(query.signedExtensions),
      } as SignerPayloadJSON),
    [query],
  );
}

export async function signPopupMessages({
  id,
  signature,
}: SignerResult): Promise<void> {
  await sendPopupResponse({
    id: String(id),
    signature,
  });
}
