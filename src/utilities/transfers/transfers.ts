import BN from 'bn.js';

import { ConfigService } from '@kiltprotocol/config';
import { Blockchain } from '@kiltprotocol/chain-helpers';
import { KiltKeyringPair, SubmittableExtrinsic } from '@kiltprotocol/types';

const currentTx: Record<string, SubmittableExtrinsic> = {};

interface Input {
  recipient: string;
  amount: BN;
  tip: BN;
  keypair: KiltKeyringPair;
}

export async function signTransfer(input: Input): Promise<string> {
  const { recipient, amount, keypair, tip } = input;

  const api = ConfigService.get('api');
  const tx = api.tx.balances.transfer(recipient, amount);

  const signedTx = await tx.signAsync(keypair, { tip });
  const hash = signedTx.hash.toHex();
  currentTx[hash] = signedTx;

  return hash;
}

export async function submitTransfer(hash: string): Promise<void> {
  await Blockchain.submitSignedTx(currentTx[hash]);
  delete currentTx[hash];
}
