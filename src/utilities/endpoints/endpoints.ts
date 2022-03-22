import { browser } from 'webextension-polyfill-ts';

import { storage } from '../storage/storage';
import { isInternal } from '../../configuration/variant';

const endpointKey = 'endpoints';

export const endpoints = [
  'wss://spiritnet.api.onfinality.io/public-ws',
  'wss://spiritnet.kilt.io',
  'wss://peregrine.kilt.io/parachain-public-ws',
  'wss://peregrine-stg.kilt.io/para',
  'wss://sporran-testnet.kilt.io',
];

export const publicEndpoints = {
  OnFinality: 'wss://spiritnet.api.onfinality.io/public-ws',
  'BOTLabs Trusted Entity': 'wss://spiritnet.kilt.io',
};

const backend = 'https://testnet-did-promo.sporran.org';

export const backendEndpoints = {
  promoStatus: `${backend}/promo_status`,
  createDid: `${backend}/create_did`,
};

/* Do we already build a production version first and ask QA to test it
before publishing it? Or do we suggest they test an internal version, and
if it is ok, we package a production one an upload it? We follow the safer
approach when releasing a Sporran-only functionality. We use the less safe
approach when we need to validate both endpoints, but in this case it is
explicitly about both endpoints, so the production will be tested anyway,
so there's no real downside. */

export const defaultEndpoint =
  process.env.NODE_ENV === 'production' && !isInternal
    ? endpoints[0]
    : endpoints[4];

export async function getEndpoint(): Promise<string> {
  return (await storage.get(endpointKey))[endpointKey] || defaultEndpoint;
}

export async function setEndpoint(endpoint: string): Promise<void> {
  await storage.set({ [endpointKey]: endpoint });
  await browser.runtime.reload();
}
