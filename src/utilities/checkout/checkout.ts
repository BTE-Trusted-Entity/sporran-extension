import type { KiltAddress } from '@kiltprotocol/sdk-js';

import ky from 'ky';

import { getEndpoint, KnownEndpoints } from '../endpoints/endpoints';

const checkoutURLs: Record<KnownEndpoints, string> = {
  'wss://kilt-rpc.dwellir.com': 'https://checkout.kilt.io',
  'wss://spiritnet.kilt.io': 'https://checkout.kilt.io',
  'wss://spiritnet.api.onfinality.io/public-ws': 'https://checkout.kilt.io',
  'wss://peregrine.kilt.io': 'https://dev.checkout.kilt.io',
  'wss://peregrine-stg.kilt.io/para': 'https://smoke.checkout.kilt.io',
};

export async function getCheckoutURL() {
  const endpoint = await getEndpoint();
  return checkoutURLs[endpoint];
}

function localizeCost(cost: string) {
  return parseFloat(cost).toLocaleString(undefined, {
    style: 'currency',
    currency: 'EUR',
    currencyDisplay: 'code',
  });
}

interface Costs {
  did: string;
  w3n: string;
  paymentAddress: KiltAddress;
}

export async function getCheckoutCosts(): Promise<Costs> {
  const checkout = await getCheckoutURL();

  const { did, w3n, paymentAddress } = await ky
    .get(`${checkout}/api/costs`)
    .json<Costs>();

  return {
    did: localizeCost(did),
    w3n: localizeCost(w3n),
    paymentAddress,
  };
}
