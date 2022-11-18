import { Web3Names, Chain } from '@kiltprotocol/did';
import { BlockchainApiConnection } from '@kiltprotocol/chain-helpers';
import { Deposit, DidUri, IIdentity } from '@kiltprotocol/types';
import { Option, Struct, u64 } from '@polkadot/types';
import { AccountId } from '@polkadot/types/interfaces';

import BN from 'bn.js';

import { isFullDid, parseDidUri } from '../did/did';
import { useAsyncValue } from '../useAsyncValue/useAsyncValue';

interface Web3NameData extends Struct {
  owner: AccountId;
  claimedAt: u64;
  deposit: Deposit;
}

interface DepositData {
  amount: BN;
  owner?: IIdentity['address'];
}

async function getDefaultDeposit() {
  return { amount: await Web3Names.queryDepositAmount() };
}

async function getDepositWeb3Name(
  did: DidUri | undefined,
): Promise<DepositData | undefined> {
  if (!did || !isFullDid(did)) {
    return getDefaultDeposit();
  }

  const web3name = await Web3Names.queryWeb3NameForDid(did);

  if (!web3name) {
    return getDefaultDeposit();
  }

  const { api } = await BlockchainApiConnection.getConnectionOrConnect();

  const data = await api.query.web3Names.owner<Option<Web3NameData>>(web3name);

  if (data.isNone) {
    return;
  }
  const { deposit } = data.unwrap();

  const { owner, amount } = deposit;

  return { owner: owner.toString(), amount };
}

export function useDepositWeb3Name(
  did: DidUri | undefined,
): DepositData | undefined {
  return useAsyncValue(getDepositWeb3Name, [did]);
}

export async function getDepositDid(
  did: DidUri | undefined,
): Promise<DepositData | undefined> {
  if (!did) {
    return { amount: await Chain.queryDepositAmount() };
  }

  const { identifier, type } = parseDidUri(did);

  if (type === 'light') {
    return { amount: await Chain.queryDepositAmount() };
  }

  const details = await Chain.queryDetails(identifier);

  return details?.deposit;
}

export function useDepositDid(
  did: DidUri | undefined,
): DepositData | undefined {
  return useAsyncValue(getDepositDid, [did]);
}
