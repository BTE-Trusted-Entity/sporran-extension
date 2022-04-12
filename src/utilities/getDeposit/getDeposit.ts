import { Web3Names, DidChain } from '@kiltprotocol/did';
import { BlockchainApiConnection } from '@kiltprotocol/chain-helpers';
import { Deposit, IDidDetails, IIdentity } from '@kiltprotocol/types';
import { Option, Struct, u64 } from '@polkadot/types';
import { AccountId } from '@polkadot/types/interfaces';

import BN from 'bn.js';

import { parseDidUri } from '../did/did';
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

export async function getDepositWeb3Name(
  did: IDidDetails['did'],
): Promise<DepositData | undefined> {
  const web3name = await Web3Names.queryWeb3NameForDid(did);

  if (!web3name) {
    return { amount: await Web3Names.queryDepositAmount() };
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
  did: IDidDetails['did'],
): DepositData | undefined {
  return useAsyncValue(getDepositWeb3Name, [did]);
}

export async function getDepositDid(
  did: IDidDetails['did'],
): Promise<DepositData | undefined> {
  const { identifier, type } = parseDidUri(did);

  if (type === 'light') {
    return { amount: await DidChain.queryDepositAmount() };
  }

  const details = await DidChain.queryDetails(identifier);

  return details?.deposit;
}

export function useDepositDid(
  did: IDidDetails['did'],
): DepositData | undefined {
  return useAsyncValue(getDepositDid, [did]);
}
