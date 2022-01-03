import { DAppName } from './DAppName';
import { Origin } from './Origin';

export type AccessInput = DAppName;

export type AccessOriginInput = AccessInput & Origin;

export type AccessOutput = string;
