import { Runtime } from 'webextension-polyfill-ts';

import { debounceAsync } from '../../utilities/debounceAsync/debounceAsync';
import { PopupChannel } from '../../channels/base/PopupChannel/PopupChannel';
import {
  getAuthorized,
  setAuthorized,
} from '../../utilities/authorizedStorage/authorizedStorage';

import { contentAccessChannel } from './contentAccessChannel';
import { getOrigin, Origin } from './getOrigin';
import { AccessInput, AccessOutput } from './types';

export const backgroundAccessChannel = new PopupChannel<
  AccessInput & Origin,
  AccessOutput
>('authorize');

async function unsafeCheckAccess(
  input: AccessInput,
  sender: Runtime.MessageSender,
) {
  const authorizedDApps = await getAuthorized();

  const origin = getOrigin(sender);
  if (authorizedDApps[origin]) {
    return true;
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

  return true;
}

export const checkAccess = debounceAsync(unsafeCheckAccess);

export function initBackgroundAccessChannel(): void {
  contentAccessChannel.produce(checkAccess);
}
