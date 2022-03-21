import { storage } from '../storage/storage';

import { IdentitiesMap } from './types';

export const IDENTITIES_KEY = 'identities';

export async function getIdentities(): Promise<IdentitiesMap> {
  const stored = (await storage.get(IDENTITIES_KEY))[IDENTITIES_KEY];
  if (stored) {
    return stored;
  }

  await storage.set({ [IDENTITIES_KEY]: {} });
  return {};
}
