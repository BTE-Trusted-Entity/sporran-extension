import { browser } from 'webextension-polyfill-ts';
import { storage } from '../storage/storage';

const endpointKey = 'endpoints';

export const endpoints = [
  'wss://spiritnet.kilt.io',
  'wss://kilt-peregrine-k8s.kilt.io',
  'wss://full-nodes.kilt.io:443',
  'wss://full-nodes.staging.kilt.io:443',
  'wss://full-nodes-lb.devnet.kilt.io:443',
];

export async function getEndpoint(): Promise<string> {
  return (await storage.get(endpointKey))[endpointKey] || endpoints[0];
}

export async function setEndpoint(endpoint: string): Promise<void> {
  await storage.set({ [endpointKey]: endpoint });
  await browser.runtime.reload();
}
