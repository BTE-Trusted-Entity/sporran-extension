import { browser } from 'webextension-polyfill-ts';
import { storage } from '../storage/storage';

const endpointKey = 'endpoints';

export const endpoints = [
  'wss://spiritnet.api.onfinality.io/public-ws',
  'wss://spiritnet.kilt.io',
  'wss://peregrine.kilt.io',
  'wss://kilt-peregrine-stg.kilt.io',
];

export const publicEndpoints = {
  OnFinality: 'wss://spiritnet.api.onfinality.io/public-ws',
  'BOTLabs Trusted Entity': 'wss://spiritnet.kilt.io',
};

export async function getEndpoint(): Promise<string> {
  return (await storage.get(endpointKey))[endpointKey] || endpoints[0];
}

export async function setEndpoint(endpoint: string): Promise<void> {
  await storage.set({ [endpointKey]: endpoint });
  await browser.runtime.reload();
}
