import browser from 'webextension-polyfill';

import { storage } from '../storage/storage';
import { isInternal } from '../../configuration/variant';

const endpointKey = 'endpoints';

export const endpoints = [
  'wss://kilt-rpc.dwellir.com',
  'wss://spiritnet.api.onfinality.io/public-ws',
  'wss://spiritnet.kilt.io',
  'wss://peregrine.kilt.io',
  'wss://peregrine-stg.kilt.io/para',
] as const;

export type KnownEndpoints = (typeof endpoints)[number];

export const publicEndpoints = {
  BOTLabs: 'wss://spiritnet.kilt.io',
  Dwellir: 'wss://kilt-rpc.dwellir.com',
  OnFinality: 'wss://spiritnet.api.onfinality.io/public-ws',
};

/* Do we already build a production version first and ask QA to test it
before publishing it? Or do we suggest they test an internal version, and
if it is ok, we package a production one an upload it? We follow the safer
approach when releasing a Sporran-only functionality. We use the less safe
approach when we need to validate both endpoints, but in this case it is
explicitly about both endpoints, so the production will be tested anyway,
so there's no real downside. */

export const defaultEndpoint: KnownEndpoints =
  process.env.NODE_ENV === 'production' && !isInternal
    ? 'wss://kilt-rpc.dwellir.com'
    : 'wss://peregrine.kilt.io';

/**
 * Always returns a value from a known list, to be used in the mappings of an endpoint to something else
 */
export async function getEndpoint(): Promise<KnownEndpoints> {
  const stored = (await storage.get(endpointKey))[endpointKey];

  const isKnown = endpoints.includes(stored);
  return isKnown ? stored : defaultEndpoint;
}

/**
 * The internal version allows the developers to specify any custom endpoint
 */
export async function getStoredEndpoint(): Promise<string[]> {
  const storedStr: string | undefined = (await storage.get(endpointKey))[
    endpointKey
  ];
  if (!storedStr) {
    return [defaultEndpoint];
  }

  const stored: string[] = storedStr.split(',');

  if (!isInternal) {
    stored.forEach((ep, i) => {
      if (!endpoints.includes(ep as any)) {
        stored[i] = defaultEndpoint;
      }
    });
  }

  return stored;
}

export async function setEndpoint(endpoints: string[]): Promise<void> {
  await storage.set({ [endpointKey]: endpoints.join(',') });
  await browser.runtime.reload();
}
