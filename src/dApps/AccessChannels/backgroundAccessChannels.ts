import { PopupChannel } from '../../channels/base/PopupChannel/PopupChannel';

import { contentAccessChannel } from './contentAccessChannel';
import { getAuthorizedOrigin} from './getAuthorizedOrigin';
import { AccessInput } from './types';
import { Origin } from './Origin';

export const backgroundAccessChannel = new PopupChannel<
  AccessInput & Origin,
  boolean
>('authorize');

export function initBackgroundAccessChannel(): void {
  contentAccessChannel.produce(getAuthorizedOrigin);
}
