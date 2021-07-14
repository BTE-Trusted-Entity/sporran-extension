import { IAttestedClaim } from '@kiltprotocol/types';

export interface ShareInput {
  [key: string]: string;
}

export type ShareOutput = IAttestedClaim[];
