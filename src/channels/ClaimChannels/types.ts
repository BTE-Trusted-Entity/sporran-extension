import { RequestForAttestation } from '@kiltprotocol/core';

export interface ClaimInput {
  [key: string]: string;
}

export type ClaimOutput = RequestForAttestation;
