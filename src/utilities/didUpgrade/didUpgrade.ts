import {
  Did,
  DidDocument,
  DidUri,
  KiltAddress,
  KiltKeyringPair,
  SignExtrinsicCallback,
  SubmittableExtrinsic,
} from '@kiltprotocol/sdk-js';

import { parseDidUri } from '../did/did';

interface DidTransaction {
  extrinsic: SubmittableExtrinsic;
  did: DidUri;
}

export async function getTransaction(
  lightDidDocument: DidDocument,
  keypair: KiltKeyringPair,
  sign: SignExtrinsicCallback,
  submitter?: KiltAddress,
): Promise<DidTransaction> {
  const { fullDid: did } = parseDidUri(lightDidDocument.uri);

  const extrinsic = await Did.getStoreTx(
    lightDidDocument,
    submitter || keypair.address,
    async (input) => sign({ ...input, did }),
  );

  return { extrinsic, did };
}
