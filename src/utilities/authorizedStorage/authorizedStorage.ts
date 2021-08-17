import { storage } from '../storage/storage';

const authorizedKey = 'authorizedDApps';

interface AuthorizedType {
  [key: string]: boolean;
}

export async function getAuthorized(): Promise<AuthorizedType> {
  return (await storage.get(authorizedKey))[authorizedKey] || [];
}

export async function setAuthorized(authorized: AuthorizedType): Promise<void> {
  await storage.set({ [authorizedKey]: authorized });
}
