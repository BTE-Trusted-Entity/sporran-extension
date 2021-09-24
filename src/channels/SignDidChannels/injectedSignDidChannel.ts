import { WindowChannel } from '../base/WindowChannel/WindowChannel';
import { SignDidPopupInput, SignDidPopupOutput } from './types';

export const injectedSignDidChannel = new WindowChannel<
  Omit<SignDidPopupInput, 'origin'>,
  SignDidPopupOutput
>('signDid');
