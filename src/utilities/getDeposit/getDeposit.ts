import { ConfigService, Did, DidUri, KiltAddress } from '@kiltprotocol/sdk-js';

import BN from 'bn.js';

import { isFullDid } from '../did/did';
import { useAsyncValue } from '../useAsyncValue/useAsyncValue';
import { ActionType } from '../../views/DidEndpointsSign/DidEndpointsSign';

interface DepositData {
  amount: BN;
  owner?: KiltAddress;
}

async function getDefaultDeposit() {
  const api = ConfigService.get('api');
  return { amount: api.consts.web3Names.deposit };
}

async function getDepositWeb3Name(
  did: DidUri | undefined,
): Promise<DepositData | undefined> {
  if (!did || !isFullDid(did)) {
    return getDefaultDeposit();
  }

  const api = ConfigService.get('api');

  const { web3Name } = Did.linkedInfoFromChain(
    await api.call.did.query(Did.toChain(did)),
  );

  if (!web3Name) {
    return getDefaultDeposit();
  }

  const data = await api.query.web3Names.owner(web3Name);

  if (data.isNone) {
    return;
  }
  return Did.depositFromChain(data.unwrap().deposit);
}

export function useDepositWeb3Name(
  did: DidUri | undefined,
): DepositData | undefined {
  return useAsyncValue(getDepositWeb3Name, [did]);
}

export async function getDepositDid(
  did: DidUri | undefined,
): Promise<DepositData | undefined> {
  const api = ConfigService.get('api');

  if (!did || Did.parse(did).type === 'light') {
    const baseDeposit = api.consts.did.baseDeposit;
    const keyDeposit = api.consts.did.keyDeposit;
    const amount: BN = baseDeposit.add(keyDeposit).add(keyDeposit);
    return { amount };
  }

  return Did.depositFromChain(
    (await api.query.did.did(Did.toChain(did))).unwrap().deposit,
  );
}

export function useDepositDid(
  did: DidUri | undefined,
): DepositData | undefined {
  return useAsyncValue(getDepositDid, [did]);
}

export function getDepositServiceEndpoint(type: ActionType): DepositData {
  const api = ConfigService.get('api');
  if (type !== 'add' || !('serviceEndpointDeposit' in api.consts.did)) {
    return { amount: new BN(0) };
  }

  return { amount: api.consts.did.serviceEndpointDeposit as BN };
}
