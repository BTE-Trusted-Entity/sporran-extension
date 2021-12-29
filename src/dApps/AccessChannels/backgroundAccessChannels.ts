import { PopupChannel } from '../../channels/base/PopupChannel/PopupChannel';

import { contentAccessChannel } from './contentAccessChannel';
import { getAuthorizedOrigin, Origin } from './getAuthorizedOrigin';
import { AccessInput } from './types';

export const backgroundAccessChannel = new PopupChannel<
  AccessInput & Origin,
  boolean
>('authorize');

export function initBackgroundAccessChannel(): void {
  contentAccessChannel.produce(getAuthorizedOrigin);
}
