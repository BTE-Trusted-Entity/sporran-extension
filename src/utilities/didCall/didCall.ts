import { SubmittableExtrinsic } from '@kiltprotocol/types';
import ky from 'ky';

import { backendEndpoints } from '../endpoints/endpoints';

export async function submitDidCall(
  extrinsic: SubmittableExtrinsic,
): Promise<{ tx_hash: string }> {
  const input = {
    call: extrinsic.args[0].toHex(),
    signature: extrinsic.args[1].toHex(),
  };
  return ky.post(backendEndpoints.submitDidCall, { json: input }).json();
}

export async function waitFinalized(txHash: string): Promise<boolean> {
  return ky
    .get(`${backendEndpoints.waitFinalized}?tx_hash=${txHash}`, {
      timeout: false,
    })
    .json();
}
