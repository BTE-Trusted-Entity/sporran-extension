import { storage } from '../storage/storage';
import { getPopupResult } from '../../connection/PopupMessages/PopupMessages';
import { respondToInjectedEnableRequest } from '../../connection/InjectedEnableMessages/InjectedEnableMessages';

const authorizedKey = 'authorizedDApps';

interface AuthorizedType {
  [key: string]: boolean;
}

async function getAuthorized(): Promise<AuthorizedType> {
  return (await storage.get(authorizedKey))[authorizedKey] || [];
}

async function setAuthorized(authorized: AuthorizedType) {
  return await storage.set({ [authorizedKey]: authorized });
}

export async function authorize(
  name: string,
  fullOrigin: string,
): Promise<void> {
  const origin = fullOrigin.replace(/#.*$/, '');

  const authorizedDApps = await getAuthorized();
  const key = `${name}\n${origin}`;

  if (authorizedDApps[key]) {
    return;
  }

  if (authorizedDApps[key] === false) {
    throw new Error('Not authorized');
  }

  const response = await getPopupResult('authorize', { name, origin });
  const authorized = response.authorized === 'authorized';

  await setAuthorized({
    ...authorizedDApps,
    [key]: authorized,
  });

  if (!authorized) {
    throw new Error('Not authorized');
  }
}

export function handleAllInjectedEnableRequests(origin: string): void {
  respondToInjectedEnableRequest(async (request) => {
    try {
      await authorize(request.name, origin);
      return { authorized: true };
    } catch (error) {
      console.error(error);
      return { authorized: false };
    }
  });
}
