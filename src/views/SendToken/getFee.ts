import { ConfigService } from '@kiltprotocol/sdk-js';
import BN from 'bn.js';

import { makeFakeIdentityCrypto } from '../../utilities/makeFakeIdentityCrypto/makeFakeIdentityCrypto';

interface FeeInput {
  recipient: string;
  amount: BN;
  tip: BN;
}

const fallbackAddressForFee =
  '4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1';

export async function getFee(input: FeeInput): Promise<BN> {
  const api = ConfigService.get('api');

  const tx = api.tx.balances.transfer(
    input.recipient || fallbackAddressForFee,
    input.amount,
  );

  // Including any signature increases the transaction size and the fee
  const { keypair } = makeFakeIdentityCrypto();
  const signedTx = await tx.signAsync(keypair, input);
  return (await signedTx.paymentInfo(keypair)).partialFee;
}
