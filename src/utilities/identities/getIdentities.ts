import { storage } from '../storage/storage';
import { IdentitiesMap } from './types';

export const IDENTITIES_KEY = 'identities';

export async function getIdentities(): Promise<IdentitiesMap> {
  return (await storage.get(IDENTITIES_KEY))[IDENTITIES_KEY] || {};
}
