import { PopupChannel } from '../../channels/base/PopupChannel/PopupChannel';
import {
  getAuthorized,
  setAuthorized,
} from '../../utilities/authorizedStorage/authorizedStorage';

import { contentAccessChannel } from './contentAccessChannel';
import { AccessInput, AccessOutput } from './types';

export const backgroundAccessChannel = new PopupChannel<
  AccessInput,
  AccessOutput
>('authorize');

export function initBackgroundAccessChannel(): void {
  contentAccessChannel.produce(async (input, sender) => {
    const authorizedDApps = await getAuthorized();

    const { origin, dAppName } = input;
    if (authorizedDApps[origin]) {
      return true;
    }

    if (authorizedDApps[origin] === false) {
      throw new Error('Not authorized');
    }

    const authorized = await backgroundAccessChannel.get(
      { dAppName, origin },
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
  });
}
