import type { Did } from '@kiltprotocol/types';

import { ConfigService } from '@kiltprotocol/sdk-js';

import { useMemo } from 'react';
import BN from 'bn.js';

import { authorizeTx } from '@kiltprotocol/did';

import { useAsyncValue } from '../useAsyncValue/useAsyncValue';
import { useDepositWeb3Name } from '../getDeposit/getDeposit';
import { useAddressBalance } from '../../components/Balance/Balance';
import { makeFakeIdentityCrypto } from '../makeFakeIdentityCrypto/makeFakeIdentityCrypto';

async function getFee(did: Did | undefined) {
  if (!did) {
    return;
  }

  const { address, keypair, signers } = await makeFakeIdentityCrypto();

  const api = ConfigService.get('api');
  const authorized = await authorizeTx(
    did,
    api.tx.web3Names.claim('01234567890123456789012345678901'),
    signers,
    address,
  );
  const signed = await authorized.signAsync(keypair);
  return (await signed.paymentInfo(keypair)).partialFee;
}

export function useKiltCosts(
  address: string,
  did: Did | undefined,
): {
  fee?: BN;
  deposit?: BN;
  total?: BN;
  insufficientKilt: boolean;
} {
  const fee = useAsyncValue(getFee, [did]);
  const deposit = useDepositWeb3Name(did);

  const total = useMemo(
    () => (fee && deposit ? fee.add(deposit.amount) : undefined),
    [deposit, fee],
  );

  const balance = useAddressBalance(address);
  const insufficientKilt = Boolean(
    total && balance && balance.transferable.lt(total),
  );

  return { fee, deposit: deposit?.amount, total, insufficientKilt };
}
