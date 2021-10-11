import { PopupChannel } from '../base/PopupChannel/PopupChannel';
import { ShareInput, ShareOutput } from './types';

export const shareChannel = new PopupChannel<ShareInput, ShareOutput>('share');
