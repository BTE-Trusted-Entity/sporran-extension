import BN from 'bn.js';

import { SubmittableExtrinsic } from '@kiltprotocol/types';
import { BlockchainApiConnection } from '@kiltprotocol/chain-helpers';

export async function getExtrinsicFee(
  extrinsic: SubmittableExtrinsic,
): Promise<BN> {
  const blockchain = await BlockchainApiConnection.getConnectionOrConnect();
  const { partialFee } = await blockchain.api.rpc.payment.queryInfo(
    extrinsic.toHex(),
  );
  return partialFee;
}
