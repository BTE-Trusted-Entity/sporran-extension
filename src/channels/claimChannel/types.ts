import type { Did } from '@kiltprotocol/types';
import type {
  IEncryptedMessage,
  ITerms,
} from '@kiltprotocol/kilt-extension-api/types';

export interface ClaimInput extends ITerms {
  attesterName: string;
  attesterDid: Did;
  specVersion: '1.0' | '3.0';
}

export type ClaimOutput = IEncryptedMessage;
