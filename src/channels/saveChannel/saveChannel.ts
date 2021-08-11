import { PopupChannel } from '../base/PopupChannel/PopupChannel';
import { SaveInput, SaveOutput } from './types';

export const saveChannel = new PopupChannel<SaveInput, SaveOutput>('save');
