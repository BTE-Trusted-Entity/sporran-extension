import { DidUtils } from '@kiltprotocol/did';
import { IDidDetails } from '@kiltprotocol/types';

export function isFullDid(did: IDidDetails['did']): boolean {
  return DidUtils.parseDidUrl(did).type === 'full';
}
