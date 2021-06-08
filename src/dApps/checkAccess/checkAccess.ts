import {
  getAuthorized,
  makeDAppKey,
  setAuthorized,
} from '../../utilities/authorizedStorage/authorizedStorage';
import { injectedAccessChannel } from '../AccessChannels/injectedAccessChannel';
import { contentAccessChannel } from '../AccessChannels/browserAccessChannels';

export async function checkAccess(
  name: string,
  fullOrigin: string,
): Promise<void> {
  const origin = fullOrigin.replace(/#.*$/, '');

  const authorizedDApps = await getAuthorized();
  const key = makeDAppKey(name, origin);

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
