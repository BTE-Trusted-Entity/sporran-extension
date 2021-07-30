import { RequestForAttestation } from '@kiltprotocol/core';
import { ITerms } from '@kiltprotocol/types';

// export interface ClaimInput {
//   [key: string]: string;
// }

export interface ClaimInput extends ITerms {
  Attester: string;
}

export type ClaimOutput = RequestForAttestation;
