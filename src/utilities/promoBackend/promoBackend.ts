import ky from 'ky';
import { HexString } from '@polkadot/util/types';

import { SubmittableExtrinsic } from '@kiltprotocol/types';

import { getEndpoint } from '../endpoints/endpoints';

const backendOrigins: Record<string, string> = {
  'wss://spiritnet.api.onfinality.io/public-ws':
    'https://did-promo.sporran.org',
  'wss://spiritnet.kilt.io': 'https://did-promo.sporran.org',
  'wss://sporran-testnet.kilt.io': 'https://testnet-did-promo.sporran.org',
};

let backendOrigin: string;

async function setOrigin() {
  const kiltEndpoint = await getEndpoint();
  backendOrigin = backendOrigins[kiltEndpoint];
}

export async function getPromoStatus(): Promise<{
  account: string;
  remaining_dids: number;
  is_active: boolean;
}> {
  await setOrigin();

  return await ky.get(`${backendOrigin}/promo_status`).json();
}

export async function createDid(input: {
  creationDetails: HexString;
  signature: HexString;
}): Promise<{ tx_hash: HexString }> {
  await setOrigin();

  return ky.post(`${backendOrigin}/create_did`, { json: input }).json();
}

export async function submitDidCall(
  extrinsic: SubmittableExtrinsic,
): Promise<{ tx_hash: HexString }> {
  await setOrigin();

  const input = {
    call: extrinsic.args[0].toHex(),
    signature: extrinsic.args[1].toHex(),
  };
  return ky.post(`${backendOrigin}/submit_did_call`, { json: input }).json();
}

export async function waitFinalized(tx_hash: HexString): Promise<boolean> {
  await setOrigin();

  return ky
    .get(`${backendOrigin}/wait_finalized`, {
      searchParams: { tx_hash },
      timeout: false,
    })
    .json();
}
