import { SubmittableExtrinsic } from '@kiltprotocol/types';
import ky from 'ky';

import { getBackendEndpoints } from '../getBackendEndpoints/getBackendEndpoints';

export async function submitDidCall(
  extrinsic: SubmittableExtrinsic,
): Promise<{ tx_hash: string }> {
  const backendEndpoints = await getBackendEndpoints();

  const input = {
    call: extrinsic.args[0].toHex(),
    signature: extrinsic.args[1].toHex(),
  };
  return ky.post(backendEndpoints.submitDidCall, { json: input }).json();
}

export async function waitFinalized(tx_hash: string): Promise<boolean> {
  const backendEndpoints = await getBackendEndpoints();

  return ky
    .get(backendEndpoints.waitFinalized, {
      searchParams: { tx_hash },
      timeout: false,
    })
    .json();
}
