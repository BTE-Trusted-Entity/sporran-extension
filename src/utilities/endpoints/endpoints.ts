import { browser } from 'webextension-polyfill-ts';

import { storage } from '../storage/storage';
import { isInternal } from '../../configuration/variant';

const endpointKey = 'endpoints';

export const endpoints = [
  'wss://kilt-rpc.dwellir.com',
  'wss://spiritnet.kilt.io',
  'wss://peregrine.kilt.io/parachain-public-ws',
  'wss://peregrine-stg.kilt.io/para',
  'wss://sporran-testnet.kilt.io',
] as const;

export type KnownEndpoints = (typeof endpoints)[number];

export const publicEndpoints = {
  Dwellir: 'wss://kilt-rpc.dwellir.com',
  'BOTLabs Trusted Entity': 'wss://spiritnet.kilt.io',
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
    : endpoints[2];

export async function getEndpoint(): Promise<KnownEndpoints> {
  const stored = (await storage.get(endpointKey))[endpointKey];
  if (!stored) {
    return defaultEndpoint;
  }

  const isKnown = endpoints.includes(stored);
  if (isKnown) {
    return stored;
  }

  await storage.remove(endpointKey);
  return defaultEndpoint;
}

export async function setEndpoint(endpoint: string): Promise<void> {
  await storage.set({ [endpointKey]: endpoint });
  await browser.runtime.reload();
}
