import { storage } from '../../utilities/storage/storage';
import { injectedAccessChannel } from '../AccessChannels/injectedAccessChannel';
import { contentAccessChannel } from '../AccessChannels/browserAccessChannels';

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

export async function checkAccess(
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

  const authorized = await contentAccessChannel.get({ name, origin });

  await setAuthorized({
    ...authorizedDApps,
    [key]: authorized,
  });

  if (!authorized) {
    throw new Error('Not authorized');
  }
}

export function initContentAccessChannel(origin: string): void {
  injectedAccessChannel.produce(async (input) => {
    await checkAccess(input.dAppName, origin);
  });
}
