import { BlockchainApiConnection } from '@kiltprotocol/chain-helpers';
import BN from 'bn.js';

import { makeKeyring } from '../identities/identities';

interface FeeInput {
  recipient: string;
  amount: BN;
  tip: BN;
}

const fallbackAddressForFee =
  '4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1';

export async function getFee(input: FeeInput): Promise<BN> {
  const blockchain = await BlockchainApiConnection.getConnectionOrConnect();
  const { api } = blockchain;

  const tx = api.tx.balances.transfer(
    input.recipient || fallbackAddressForFee,
    input.amount,
  );

  // Including any signature increases the transaction size and the fee
  const fakeIdentity = makeKeyring().createFromUri('//Alice');
  const signedTx = await blockchain.signTx(fakeIdentity, tx, input.tip);
  return (await signedTx.paymentInfo(fakeIdentity)).partialFee;
}
