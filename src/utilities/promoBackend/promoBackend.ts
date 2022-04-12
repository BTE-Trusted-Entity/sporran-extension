import ky from 'ky';
import { HexString } from '@polkadot/util/types';

import { SubmittableExtrinsic } from '@kiltprotocol/types';

import { getEndpoint } from '../endpoints/endpoints';
import { useAsyncValue } from '../useAsyncValue/useAsyncValue';

const backendOrigins: Record<string, string> = {
  'wss://kilt-rpc.dwellir.com': 'https://did-promo.sporran.org/',
  'wss://spiritnet.kilt.io': 'https://did-promo.sporran.org/',
  'wss://sporran-testnet.kilt.io': 'https://testnet-did-promo.sporran.org/',
  'wss://peregrine.kilt.io/parachain-public-ws':
    'https://peregrine-did-promo.sporran.org/',
};

async function getOrigin() {
  const kiltEndpoint = await getEndpoint();
  return ky.create({ prefixUrl: backendOrigins[kiltEndpoint] });
}

interface PromoStatus {
  account: string;
  remaining_dids: number;
  is_active: boolean;
}

export async function getPromoStatus(): Promise<PromoStatus> {
  return (await getOrigin()).get('promo_status').json();
}

export function usePromoStatus(): PromoStatus | undefined {
  return useAsyncValue(getPromoStatus, []);
}

export async function createDid(input: {
  creationDetails: HexString;
  signature: HexString;
}): Promise<{ tx_hash: HexString }> {
  return (await getOrigin()).post('create_did', { json: input }).json();
}

export async function submitDidCall(
  extrinsic: SubmittableExtrinsic,
): Promise<{ tx_hash: HexString }> {
  const input = {
    call: extrinsic.args[0].toHex(),
    signature: extrinsic.args[1].toHex(),
  };
  return (await getOrigin()).post('submit_did_call', { json: input }).json();
}

export async function waitFinalized(tx_hash: HexString): Promise<boolean> {
  return (await getOrigin())
    .get('wait_finalized', { searchParams: { tx_hash }, timeout: false })
    .json();
}
