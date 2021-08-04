import { IAttestation } from '@kiltprotocol/types';

export type SaveInput = IAttestation;

export interface SaveOutput {
  [key: string]: string;
}
