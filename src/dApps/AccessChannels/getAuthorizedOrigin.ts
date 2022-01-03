import { Runtime } from 'webextension-polyfill-ts';

import {
  getAuthorized,
  setAuthorized,
} from '../../utilities/authorizedStorage/authorizedStorage';
import { debounceAsync } from '../../utilities/debounceAsync/debounceAsync';

import { backgroundAccessChannel } from './backgroundAccessChannels';
import { AccessInput, AccessOutput } from './types';

export async function unsafeGetAuthorizedOrigin(
  input: AccessInput,
  sender: Runtime.MessageSender,
): Promise<AccessOutput> {
  const { url } = sender;
  if (!url) {
    throw new Error('Unknown origin');
  }
  const origin = new URL(url).host;

  const authorizedDApps = await getAuthorized();
  if (authorizedDApps[origin]) {
    return origin;
  }

  if (authorizedDApps[origin] === false) {
    throw new Error('Not authorized');
  }

  const authorized = await backgroundAccessChannel.get(
    { ...input, origin },
    sender,
  );

  await setAuthorized({
    ...authorizedDApps,
    [origin]: authorized,
  });

  if (!authorized) {
    throw new Error('Not authorized');
  }

  return origin;
}

export const getAuthorizedOrigin = debounceAsync(unsafeGetAuthorizedOrigin);
