import {
  getAuthorized,
  setAuthorized,
} from '../../utilities/authorizedStorage/authorizedStorage';
import { injectedAccessChannel } from '../AccessChannels/injectedAccessChannel';
import { contentAccessChannel } from '../AccessChannels/browserAccessChannels';

export async function checkAccess(name: string, origin: string): Promise<void> {
  const authorizedDApps = await getAuthorized();

  if (authorizedDApps[origin]) {
    return;
  }

  if (authorizedDApps[origin] === false) {
    throw new Error('Not authorized');
  }

  const authorized = await contentAccessChannel.get({ name, origin });

  await setAuthorized({
    ...authorizedDApps,
    [origin]: authorized,
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
